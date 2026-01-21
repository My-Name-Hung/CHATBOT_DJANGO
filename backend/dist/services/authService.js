import bcrypt from "bcryptjs";
import { UserModel } from "../db/models/User.js";
import { signAccessToken } from "../utils/jwt.js";
export const authService = {
    async register(input) {
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
    async login(input) {
        const user = await UserModel.findOne({ email: input.email });
        if (!user)
            return { message: "Email hoáº·c máº­t kháº©u khĂ´ng Ä‘Ăºng." };
        const ok = await bcrypt.compare(input.password, user.password);
        if (!ok)
            return { message: "Email hoáº·c máº­t kháº©u khĂ´ng Ä‘Ăºng." };
        const token = signAccessToken({ userId: String(user._id) });
        return {
            token,
            user: { id: String(user._id), email: user.email }
        };
    },
    async me(input) {
        const user = (await UserModel.findById(input.userId).lean());
        if (!user)
            return { message: "KhĂ´ng tĂ¬m tháº¥y ngÆ°á»i dĂ¹ng." };
        return { user: { id: String(user._id), email: user.email } };
    }
};
