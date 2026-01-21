import bcrypt from "bcryptjs";

import { EmailOtpModel } from "../db/models/EmailOtp.js";
import { UserModel } from "../db/models/User.js";
import { sendOtpEmail } from "./mailService.js";
import { generateOtp, hashOtp, isStrongPassword } from "../utils/authUtils.js";
import { signAccessToken } from "../utils/jwt.js";

export interface RequestRegisterOtpInput {
  email: string;
}

export interface ConfirmRegisterWithOtpInput {
  email: string;
  password: string;
  otp: string;
}

export interface RequestResetOtpInput {
  email: string;
}

export interface ResetPasswordWithOtpInput {
  email: string;
  newPassword: string;
  otp: string;
}

const OTP_TTL_MINUTES = 10;
const MAX_ATTEMPTS = 5;

export const otpService = {
  async requestRegisterOtp(input: RequestRegisterOtpInput) {
    const existing = await UserModel.findOne({ email: input.email }).lean();
    if (existing) return { message: "Email đã tồn tại." };

    const otp = generateOtp(6);
    const otpHash = hashOtp(otp);
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60_000);

    await EmailOtpModel.create({
      email: input.email,
      purpose: "register",
      otpHash,
      attempts: 0,
      expiresAt
    });

    await sendOtpEmail({
      to: input.email,
      otp,
      title: "Mã OTP xác thực đăng ký",
      description: "Bạn đang đăng ký tài khoản ChatSF. Vui lòng dùng mã OTP để hoàn tất đăng ký."
    });

    return { ok: true };
  },

  async confirmRegisterWithOtp(input: ConfirmRegisterWithOtpInput) {
    const existing = await UserModel.findOne({ email: input.email }).lean();
    if (existing) return { message: "Email đã tồn tại." };

    if (!isStrongPassword(input.password)) {
      return {
        message: "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số."
      };
    }

    const latest = await EmailOtpModel.findOne({
      email: input.email,
      purpose: "register",
      expiresAt: { $gt: new Date() }
    })
      .sort({ createdAt: -1 })
      .exec();

    if (!latest) {
      return { message: "OTP không hợp lệ hoặc đã hết hạn." };
    }

    if (latest.attempts >= MAX_ATTEMPTS) {
      return { message: "Bạn đã nhập sai OTP quá nhiều lần. Vui lòng yêu cầu mã mới." };
    }

    const ok = hashOtp(input.otp) === latest.otpHash;
    if (!ok) {
      await EmailOtpModel.updateOne(
        { _id: latest._id },
        { $inc: { attempts: 1 } }
      );
      return { message: "OTP không đúng." };
    }

    // OTP Ä‘Ăºng -> táº¡o user
    const hashed = await bcrypt.hash(input.password, 10);
    const user = await UserModel.create({
      email: input.email,
      password: hashed,
      provider: "email"
    });

    // cleanup OTP
    await EmailOtpModel.deleteMany({ email: input.email, purpose: "register" });

    const token = signAccessToken({ userId: String(user._id) });
    return { token, user: { id: String(user._id), email: user.email } };
  },

  async requestResetOtp(input: RequestResetOtpInput) {
    const existing = await UserModel.findOne({ email: input.email }).lean();
    if (!existing) return { message: "Email chưa tồn tại. Vui lòng đăng ký." };

    const otp = generateOtp(6);
    const otpHash = hashOtp(otp);
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60_000);

    await EmailOtpModel.create({
      email: input.email,
      purpose: "reset",
      otpHash,
      attempts: 0,
      expiresAt
    });

    await sendOtpEmail({
      to: input.email,
      otp,
      title: "Mã OTP đặt lại mật khẩu",
      description: "Bạn vừa yêu cầu đặt lại mật khẩu ChatSF. Nhập mã OTP để tiếp tục."
    });

    return { ok: true };
  },

  async resetPasswordWithOtp(input: ResetPasswordWithOtpInput) {
    const user = await UserModel.findOne({ email: input.email });
    if (!user) return { message: "Email chưa tồn tại. Vui lòng đăng ký." };

    if (!isStrongPassword(input.newPassword)) {
      return {
        message: "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số."
      };
    }

    const latest = await EmailOtpModel.findOne({
      email: input.email,
      purpose: "reset",
      expiresAt: { $gt: new Date() }
    })
      .sort({ createdAt: -1 })
      .exec();

    if (!latest) return { message: "OTP không hợp lệ hoặc đã hết hạn." };

    if (latest.attempts >= MAX_ATTEMPTS) {
      return { message: "Bạn đã nhập sai OTP quá nhiều lần. Vui lòng yêu cầu mã mới." };
    }

    const ok = hashOtp(input.otp) === latest.otpHash;
    if (!ok) {
      await EmailOtpModel.updateOne(
        { _id: latest._id },
        { $inc: { attempts: 1 } }
      );
      return { message: "OTP không đúng." };
    }

    const hashed = await bcrypt.hash(input.newPassword, 10);
    await UserModel.updateOne({ _id: user._id }, { $set: { password: hashed } });

    await EmailOtpModel.deleteMany({ email: input.email, purpose: "reset" });

    return { ok: true };
  }
};
