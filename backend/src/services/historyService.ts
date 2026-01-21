import { ChatHistoryModel } from "../db/models/ChatHistory.js";

export interface ListHistoryInput {
  userId: string;
}

export interface ClearHistoryInput {
  userId: string;
}

export const historyService = {
  async list(input: ListHistoryInput) {
    const docs = (await ChatHistoryModel.find({ userId: input.userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()) as any[];

    return docs.map((d) => ({
      id: String(d._id),
      userId: String(d.userId),
      createdAt: new Date(d.createdAt).toISOString(),
      messages: d.messages || []
    }));
  },

  async getById(historyId: string, userId: string) {
    const doc = (await ChatHistoryModel.findOne({ _id: historyId, userId }).lean()) as any;
    if (!doc) return null;
    return {
      id: String(doc._id),
      userId: String(doc.userId),
      createdAt: new Date(doc.createdAt).toISOString(),
      messages: doc.messages || []
    };
  },

  async clear(input: ClearHistoryInput) {
    await ChatHistoryModel.deleteMany({ userId: input.userId });
    return { ok: true };
  }
};
