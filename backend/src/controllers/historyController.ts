import type { Response } from "express";

import type { AuthedRequest } from "../middlewares/authMiddleware.js";
import { historyService } from "../services/historyService.js";

export async function listHistoryController(req: AuthedRequest, res: Response) {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  const out = await historyService.list({ userId });
  res.json(out);
}

export async function getHistoryController(req: AuthedRequest, res: Response) {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  const { id } = req.params;
  const history = await historyService.getById(id, userId);
  if (!history) return res.status(404).json({ message: "Không tìm thấy lịch sử" });
  res.json(history);
}

export async function clearHistoryController(
  req: AuthedRequest,
  res: Response
) {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  const out = await historyService.clear({ userId });
  res.json(out);
}

