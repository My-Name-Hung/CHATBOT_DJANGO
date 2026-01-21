import fetch from "node-fetch";
import { getRequiredEnv } from "../utils/env.js";
function getGeminiBaseUrl() {
    return "https://generativelanguage.googleapis.com/v1beta";
}
function toGeminiContents(messages) {
    // Gemini API uses role: user/model and parts[].text
    return messages
        .filter((m) => m.role !== "system")
        .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
    }));
}
export const aiService = {
    async generateText(messages, opts = {}) {
        const apiKey = getRequiredEnv("GEMINI_API_KEY");
        const model = opts.model || process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
        const system = messages.find((m) => m.role === "system")?.content;
        const body = {
            ...(system ? { systemInstruction: { parts: [{ text: system }] } } : {}),
            contents: toGeminiContents(messages),
            generationConfig: {
                temperature: opts.temperature ?? 0.4,
                maxOutputTokens: opts.maxOutputTokens ?? 1024
            }
        };
        try {
            const url = `${getGeminiBaseUrl()}/models/${model}:generateContent?key=${apiKey}`;
            const resp = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            if (!resp.ok) {
                const text = await resp.text();
                throw new Error(`Gemini generateContent error: ${resp.status} ${text}`);
            }
            const data = (await resp.json());
            const out = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ||
                "";
            return { text: out.trim() };
        }
        catch (err) {
            const message = err instanceof Error ? err.message : "Gemini call failed";
            return { text: `Mình gặp lỗi khi gọi AI: ${message}` };
        }
    },
    async embedText(text) {
        const apiKey = getRequiredEnv("GEMINI_API_KEY");
        const model = "text-embedding-004";
        const body = { content: { parts: [{ text }] } };
        const url = `${getGeminiBaseUrl()}/models/${model}:embedContent?key=${apiKey}`;
        const resp = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        if (!resp.ok) {
            const raw = await resp.text();
            throw new Error(`Gemini embedContent error: ${resp.status} ${raw}`);
        }
        const data = (await resp.json());
        const vector = data?.embedding?.values;
        if (!vector?.length)
            throw new Error("Empty embedding vector");
        return { vector };
    }
};
