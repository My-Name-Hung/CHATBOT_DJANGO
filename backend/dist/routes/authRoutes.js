import { Router } from "express";
import { confirmRegisterOtpController, googleLoginController, loginController, meController, registerController, requestRegisterOtpController } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
export const authRouter = Router();
// Email / Password
authRouter.post("/register", registerController);
authRouter.post("/register/request-otp", requestRegisterOtpController);
authRouter.post("/register/confirm", confirmRegisterOtpController);
authRouter.post("/login", loginController);
// Google
authRouter.post("/google", googleLoginController);
// Me
authRouter.get("/me", authMiddleware, meController);
