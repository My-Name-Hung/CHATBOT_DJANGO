import bcrypt from "bcryptjs";

import { UserModel } from "../db/models/User.js";
import { signAccessToken } from "../utils/jwt.js";

export interface RegisterInput {
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface MeInput {
  userId: string;
}

export const authService = {
  async register(input: RegisterInput) {
    const existing = await UserModel.findOne({ email: input.email }).lean();
    if (existing) {
      return { message: "Email Ä‘Ă£ tá»“n táº¡i." };
    }

    const hashed = await bcrypt.hash(input.password, 10);
    const user = await UserModel.create({ email: input.email, password: hashed });
    const token = signAccessToken({ userId: String(user._id) });

    return {
      token,
      user: { id: String(user._id), email: user.email }
    };
  },

  async login(input: LoginInput) {
    const user = await UserModel.findOne({ email: input.email });
    if (!user) return { message: "Email hoặc mật khẩu không đúng." };

    if (!user.password) {
      return { message: "Tài khoản này chưa thiết lập mật khẩu. Vui lòng đăng ký/đặt lại mật khẩu." };
    }

    const ok = await bcrypt.compare(input.password, user.password);
    if (!ok) return { message: "Email hoặc mật khẩu không đúng." };

    const token = signAccessToken({ userId: String(user._id) });
    return {
      token,
      user: { id: String(user._id), email: user.email }
    };
  },

  async me(input: MeInput) {
    const user = (await UserModel.findById(input.userId).lean()) as any;
    if (!user) return { message: "KhĂ´ng tĂ¬m tháº¥y ngÆ°á»i dĂ¹ng." };
    return { user: { id: String(user._id), email: user.email } };
  }
};


