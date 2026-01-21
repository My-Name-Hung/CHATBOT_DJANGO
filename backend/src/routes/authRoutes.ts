import { Router } from "express";

import {
  confirmRegisterOtpController,
  confirmResetOtpController,
  googleLoginController,
  loginController,
  meController,
  registerController,
  requestRegisterOtpController,
  requestResetOtpController
} from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const authRouter = Router();

// Email / Password
authRouter.post("/register", registerController);
authRouter.post("/register/request-otp", requestRegisterOtpController);
authRouter.post("/register/confirm", confirmRegisterOtpController);
authRouter.post("/login", loginController);
authRouter.post("/password/request-otp", requestResetOtpController);
authRouter.post("/password/reset", confirmResetOtpController);

// Google
authRouter.post("/google", googleLoginController);

// Me
authRouter.get("/me", authMiddleware, meController);
