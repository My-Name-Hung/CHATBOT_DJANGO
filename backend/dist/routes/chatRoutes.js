import { Router } from "express";
import { queryController } from "../controllers/chatController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
export const chatRouter = Router();
chatRouter.post("/query", authMiddleware, queryController);
