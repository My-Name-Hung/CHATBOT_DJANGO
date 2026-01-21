import { ChatHistoryModel } from "../db/models/ChatHistory.js";
import { chatAgent } from "../agents/chatAgent.js";

export interface ChatQueryInput {
  userId: string;
  message: string;
}

export const chatService = {
  async query(input: ChatQueryInput) {
    const session = await ChatHistoryModel.create({
      userId: input.userId,
      messages: [{ role: "user", content: input.message }]
    });

    const agentOut = await chatAgent.run({
      userId: input.userId,
      message: input.message
    });

    await ChatHistoryModel.findByIdAndUpdate(session._id, {
      $push: { messages: { role: "assistant", content: agentOut.answer } },
      $set: { title: agentOut.title || input.message.slice(0, 48) }
    });

    return {
      sessionId: String(session._id),
      answer: agentOut.answer,
      sources: agentOut.sources
    };
  }
};

