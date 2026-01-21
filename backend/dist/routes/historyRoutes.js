import { Router } from "express";
import { clearHistoryController, getHistoryController, listHistoryController } from "../controllers/historyController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
export const historyRouter = Router();
historyRouter.get("/list", authMiddleware, listHistoryController);
historyRouter.get("/:id", authMiddleware, getHistoryController);
historyRouter.delete("/clear", authMiddleware, clearHistoryController);
