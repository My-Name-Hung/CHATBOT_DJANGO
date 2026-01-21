import jwt from "jsonwebtoken";
import { getRequiredEnv } from "./env.js";
export function signAccessToken(payload) {
    const secret = getRequiredEnv("JWT_SECRET");
    const expiresIn = (process.env.JWT_EXPIRES_IN || "7d");
    return jwt.sign(payload, secret, { expiresIn });
}
export function verifyAccessToken(token) {
    const secret = getRequiredEnv("JWT_SECRET");
    const decoded = jwt.verify(token, secret);
    if (!decoded || typeof decoded !== "object" || !("userId" in decoded)) {
        throw new Error("Invalid token");
    }
    return decoded;
}
