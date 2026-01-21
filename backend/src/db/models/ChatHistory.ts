import mongoose, { type InferSchemaType } from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    role: { type: String, required: true, enum: ["user", "assistant"] },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const chatHistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    messages: { type: [messageSchema], required: true, default: [] },
    title: { type: String, required: false }
  },
  { timestamps: true }
);

export type ChatHistoryDoc = InferSchemaType<typeof chatHistorySchema> & {
  _id: mongoose.Types.ObjectId;
};

export const ChatHistoryModel =
  mongoose.models.ChatHistory || mongoose.model("ChatHistory", chatHistorySchema);

