import { ChatHistoryModel } from "../db/models/ChatHistory.js";
export const historyService = {
    async list(input) {
        const docs = (await ChatHistoryModel.find({ userId: input.userId })
            .sort({ createdAt: -1 })
            .limit(50)
            .lean());
        return docs.map((d) => ({
            id: String(d._id),
            userId: String(d.userId),
            createdAt: new Date(d.createdAt).toISOString(),
            messages: d.messages || []
        }));
    },
    async getById(historyId, userId) {
        const doc = (await ChatHistoryModel.findOne({ _id: historyId, userId }).lean());
        if (!doc)
            return null;
        return {
            id: String(doc._id),
            userId: String(doc.userId),
            createdAt: new Date(doc.createdAt).toISOString(),
            messages: doc.messages || []
        };
    },
    async clear(input) {
        await ChatHistoryModel.deleteMany({ userId: input.userId });
        return { ok: true };
    }
};
