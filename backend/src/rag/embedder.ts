import { aiService } from "../services/aiService.js";

export async function embed(text: string): Promise<number[]> {
  const { vector } = await aiService.embedText(text);
  return vector;
}

