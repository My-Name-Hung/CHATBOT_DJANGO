import { getNumberEnv } from "../utils/env.js";
import { embed } from "./embedder.js";
import { getVectorAdapter } from "../vector/vectorClient.js";
export async function ragRetrieve(input) {
    const k = input.topK ?? getNumberEnv("RAG_TOP_K", 5);
    const threshold = Number(process.env.RAG_SCORE_THRESHOLD || 0.2);
    const queryEmbedding = await embed(input.query);
    const vector = await getVectorAdapter();
    const hits = await vector.search(queryEmbedding, k);
    const filtered = hits.filter((h) => h.score >= threshold);
    const contextText = filtered
        .map((h, i) => `[#${i + 1}] ${String(h.metadata?.title || "")}\n${h.text}`)
        .join("\n\n");
    return {
        contextText,
        sources: filtered.map((h) => ({
            title: String(h.metadata?.title || "Nguồn"),
            url: typeof h.metadata?.sourceUri === "string" ? h.metadata.sourceUri : undefined,
            snippet: h.text.slice(0, 240)
        }))
    };
}
