import { verifyAccessToken } from "../utils/jwt.js";
export function authMiddleware(req, res, next) {
    try {
        const header = req.headers.authorization || "";
        const token = header.startsWith("Bearer ") ? header.slice(7) : "";
        if (!token)
            return res.status(401).json({ message: "Unauthorized" });
        const payload = verifyAccessToken(token);
        req.user = { id: payload.userId };
        next();
    }
    catch {
        return res.status(401).json({ message: "Unauthorized" });
    }
}
