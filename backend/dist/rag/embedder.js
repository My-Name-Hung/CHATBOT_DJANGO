import { aiService } from "../services/aiService.js";
export async function embed(text) {
    const { vector } = await aiService.embedText(text);
    return vector;
}
