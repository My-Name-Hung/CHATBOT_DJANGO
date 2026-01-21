import { z } from "zod";
import { authService } from "../services/authService.js";
import { otpService } from "../services/otpService.js";
import { googleAuthService } from "../services/googleAuthService.js";
const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
});
const requestOtpSchema = z.object({
    email: z.string().email()
});
const confirmOtpSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    otp: z.string().min(4).max(8)
});
const googleSchema = z.object({
    credential: z.string().min(10)
});
export async function registerController(req, res) {
    // Legacy: giá»¯ láº¡i nhÆ°ng khuyáº¿n nghá»‹ dĂ¹ng OTP flow
    const input = registerSchema.parse(req.body);
    const out = await authService.register(input);
    res.json(out);
}
export async function requestRegisterOtpController(req, res) {
    const input = requestOtpSchema.parse(req.body);
    const out = await otpService.requestRegisterOtp(input);
    res.json(out);
}
export async function confirmRegisterOtpController(req, res) {
    const input = confirmOtpSchema.parse(req.body);
    const out = await otpService.confirmRegisterWithOtp(input);
    res.json(out);
}
export async function googleLoginController(req, res) {
    const input = googleSchema.parse(req.body);
    const out = await googleAuthService.loginWithGoogle(input);
    res.json(out);
}
export async function loginController(req, res) {
    const input = loginSchema.parse(req.body);
    const out = await authService.login(input);
    res.json(out);
}
export async function meController(req, res) {
    const userId = req.user?.id;
    if (!userId)
        return res.status(401).json({ message: "Unauthorized" });
    const out = await authService.me({ userId });
    res.json(out);
}
