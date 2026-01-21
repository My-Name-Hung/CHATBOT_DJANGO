import jwt, { type SignOptions } from "jsonwebtoken";

import { getRequiredEnv } from "./env.js";

export interface JwtPayload {
  userId: string;
}

export function signAccessToken(payload: JwtPayload): string {
  const secret = getRequiredEnv("JWT_SECRET");
  const expiresIn = (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"];
  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyAccessToken(token: string): JwtPayload {
  const secret = getRequiredEnv("JWT_SECRET");
  const decoded = jwt.verify(token, secret);
  if (!decoded || typeof decoded !== "object" || !("userId" in decoded)) {
    throw new Error("Invalid token");
  }
  return decoded as JwtPayload;
}
