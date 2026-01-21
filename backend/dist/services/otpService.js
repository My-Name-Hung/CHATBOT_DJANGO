import bcrypt from "bcryptjs";
import { EmailOtpModel } from "../db/models/EmailOtp.js";
import { UserModel } from "../db/models/User.js";
import { sendOtpEmail } from "./mailService.js";
import { generateOtp, hashOtp, isStrongPassword } from "../utils/authUtils.js";
import { signAccessToken } from "../utils/jwt.js";
const OTP_TTL_MINUTES = 10;
const MAX_ATTEMPTS = 5;
export const otpService = {
    async requestRegisterOtp(input) {
        const existing = await UserModel.findOne({ email: input.email }).lean();
        if (existing)
            return { message: "Email Ä‘Ă£ tá»“n táº¡i." };
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
        await sendOtpEmail({ to: input.email, otp });
        return { ok: true };
    },
    async confirmRegisterWithOtp(input) {
        const existing = await UserModel.findOne({ email: input.email }).lean();
        if (existing)
            return { message: "Email Ä‘Ă£ tá»“n táº¡i." };
        if (!isStrongPassword(input.password)) {
            return {
                message: "Máº­t kháº©u pháº£i cĂ³ Ă­t nháº¥t 8 kĂ½ tá»±, bao gá»“m chá»¯ hoa, chá»¯ thÆ°á»ng vĂ  sá»‘."
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
            return { message: "OTP khĂ´ng há»£p lá»‡ hoáº·c Ä‘Ă£ háº¿t háº¡n." };
        }
        if (latest.attempts >= MAX_ATTEMPTS) {
            return { message: "Báº¡n Ä‘Ă£ nháº­p sai OTP quĂ¡ nhiá»u láº§n. Vui lĂ²ng yĂªu cáº§u mĂ£ má»›i." };
        }
        const ok = hashOtp(input.otp) === latest.otpHash;
        if (!ok) {
            await EmailOtpModel.updateOne({ _id: latest._id }, { $inc: { attempts: 1 } });
            return { message: "OTP khĂ´ng Ä‘Ăºng." };
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
    }
};
