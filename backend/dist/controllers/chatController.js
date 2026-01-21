import { z } from "zod";
import { chatService } from "../services/chatService.js";
const querySchema = z.object({
    message: z.string().min(1)
});
export async function queryController(req, res) {
    const userId = req.user?.id;
    if (!userId)
        return res.status(401).json({ message: "Unauthorized" });
    const input = querySchema.parse(req.body);
    const out = await chatService.query({ userId, message: input.message });
    res.json({
        response: out.answer,
        historyId: out.sessionId
    });
}
