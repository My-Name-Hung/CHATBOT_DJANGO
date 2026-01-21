import { aiService } from "../services/aiService.js";
import { ragRetrieve } from "../rag/retriever.js";

export interface ChatAgentInput {
  userId: string;
  message: string;
}

export interface ChatAgentSource {
  title: string;
  url?: string;
  snippet: string;
}

export interface ChatAgentOutput {
  title?: string;
  answer: string;
  sources: ChatAgentSource[];
}

type Intent = "smalltalk" | "rag_question" | "unknown";

function detectIntent(message: string): Intent {
  const m = message.toLowerCase();
  if (m.includes("tài liệu") || m.includes("pdf") || m.includes("nguồn")) {
    return "rag_question";
  }
  if (m.length < 24) return "smalltalk";
  return "unknown";
}

function decideTool(intent: Intent): "rag" | "none" {
  if (intent === "rag_question") return "rag";
  // mặc định vẫn thử RAG nhẹ nếu là câu hỏi dài
  if (intent === "unknown") return "rag";
  return "none";
}

export const chatAgent = {
  async run(input: ChatAgentInput): Promise<ChatAgentOutput> {
    // 1) Detect intent
    const intent = detectIntent(input.message);

    // 2) Decide tool
    const tool = decideTool(intent);

    // 3) Execute selected tool(s)
    const retrieved =
      tool === "rag"
        ? await ragRetrieve({ query: input.message, topK: 5 })
        : { contextText: "", sources: [] as ChatAgentSource[] };

    // 4) Summarize result (ngắn gọn để cắm vào prompt)
    const contextBlock = retrieved.contextText
      ? `\n\nNgữ cảnh tham khảo:\n${retrieved.contextText}`
      : "";

    // 5) Generate final answer
    const system =
      "Bạn là ChatSF — trợ lý AI tiếng Việt. Trả lời ngắn gọn, rõ ràng, đúng trọng tâm. " +
      "Nếu có ngữ cảnh tham khảo thì ưu tiên dựa vào đó, và không bịa nguồn.";

    const userPrompt =
      `Câu hỏi của người dùng:\n${input.message}` +
      contextBlock +
      "\n\nYêu cầu: Nếu có nguồn tham khảo thì hãy trích dẫn ngắn gọn (không cần link dài).";

    const { text } = await aiService.generateText(
      [
        { role: "system", content: system },
        { role: "user", content: userPrompt }
      ],
      { temperature: 0.35, maxOutputTokens: 900 }
    );

    return {
      title: input.message.slice(0, 48),
      answer: text,
      sources: retrieved.sources
    };
  }
};

