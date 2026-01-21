import type { Request, Response } from "express";
import { z } from "zod";

import { authService } from "../services/authService.js";
import type { AuthedRequest } from "../middlewares/authMiddleware.js";
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

const resetOtpRequestSchema = z.object({
  email: z.string().email()
});

const resetOtpConfirmSchema = z.object({
  email: z.string().email(),
  newPassword: z.string().min(8),
  otp: z.string().min(4).max(8)
});

const googleSchema = z.object({
  credential: z.string().min(10)
});

export async function registerController(req: Request, res: Response) {
  // Legacy: giá»¯ láº¡i nhÆ°ng khuyáº¿n nghá»‹ dĂ¹ng OTP flow
  const input = registerSchema.parse(req.body);
  const out = await authService.register(input);
  res.json(out);
}

export async function requestRegisterOtpController(req: Request, res: Response) {
  const input = requestOtpSchema.parse(req.body);
  const out = await otpService.requestRegisterOtp(input);
  if (out.message) return res.status(400).json(out);
  res.json(out);
}

export async function confirmRegisterOtpController(req: Request, res: Response) {
  const input = confirmOtpSchema.parse(req.body);
  const out = await otpService.confirmRegisterWithOtp(input);
  if (out.message) return res.status(400).json(out);
  res.json(out);
}

export async function googleLoginController(req: Request, res: Response) {
  const input = googleSchema.parse(req.body);
  const out = await googleAuthService.loginWithGoogle(input);
  res.json(out);
}

export async function loginController(req: Request, res: Response) {
  const input = loginSchema.parse(req.body);
  const out = await authService.login(input);
  if (out.message) return res.status(400).json(out);
  res.json(out);
}

export async function meController(req: AuthedRequest, res: Response) {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  const out = await authService.me({ userId });
  res.json(out);
}

export async function requestResetOtpController(req: Request, res: Response) {
  const input = resetOtpRequestSchema.parse(req.body);
  const out = await otpService.requestResetOtp(input);
  if (out.message) return res.status(400).json(out);
  res.json(out);
}

export async function confirmResetOtpController(req: Request, res: Response) {
  const input = resetOtpConfirmSchema.parse(req.body);
  const out = await otpService.resetPasswordWithOtp(input);
  if (out.message) return res.status(400).json(out);
  res.json(out);
}
