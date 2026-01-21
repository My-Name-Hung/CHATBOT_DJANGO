import type { Request, Response } from "express";

export function notFoundMiddleware(req: Request, res: Response) {
  res.status(404).json({ message: `Not found: ${req.method} ${req.path}` });
}

