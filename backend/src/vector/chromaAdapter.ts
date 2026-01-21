import fetch from "node-fetch";

import { getRequiredEnv } from "../utils/env.js";
import type {
  VectorAdapter,
  VectorDocument,
  VectorSearchResult
} from "./vectorTypes.js";

export class ChromaAdapter implements VectorAdapter {
  private baseUrl: string;
  private collection: string;

  constructor() {
    this.baseUrl = process.env.CHROMA_URL || "http://localhost:8000";
    this.collection = process.env.CHROMA_COLLECTION || "chatsf_docs";
  }

  async init(): Promise<void> {
    // Chroma server is external; we just validate env format.
    if (!this.baseUrl.startsWith("http")) {
      throw new Error("Invalid CHROMA_URL");
    }
  }

  async addDocuments(docs: VectorDocument[]): Promise<void> {
    // Minimal REST calls; if your chroma differs, adapt endpoints accordingly.
    // This is intentionally lightweight.
    const url = `${this.baseUrl}/api/v1/collections/${this.collection}/add`;
    const body = {
      ids: docs.map((d) => d.id),
      embeddings: docs.map((d) => d.embedding),
      documents: docs.map((d) => d.text),
      metadatas: docs.map((d) => d.metadata)
    };

    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!resp.ok) {
      const raw = await resp.text();
      throw new Error(`Chroma add error: ${resp.status} ${raw}`);
    }
  }

  async search(queryEmbedding: number[], k: number): Promise<VectorSearchResult[]> {
    const url = `${this.baseUrl}/api/v1/collections/${this.collection}/query`;
    const body = { query_embeddings: [queryEmbedding], n_results: k };
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!resp.ok) {
      const raw = await resp.text();
      throw new Error(`Chroma query error: ${resp.status} ${raw}`);
    }
    const data = (await resp.json()) as any;
    const ids: string[] = data?.ids?.[0] || [];
    const docs: string[] = data?.documents?.[0] || [];
    const metas: any[] = data?.metadatas?.[0] || [];
    const dists: number[] = data?.distances?.[0] || [];

    return ids.map((id, i) => ({
      id,
      score: typeof dists[i] === "number" ? 1 / (1 + dists[i]) : 0,
      text: docs[i] || "",
      metadata: metas[i] || {}
    }));
  }

  async clear(): Promise<void> {
    const url = `${this.baseUrl}/api/v1/collections/${this.collection}/delete`;
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ where: {} })
    });
    if (!resp.ok) {
      const raw = await resp.text();
      throw new Error(`Chroma clear error: ${resp.status} ${raw}`);
    }
  }
}

export function getChromaConfig() {
  // Touch see env is present (optional). Keep for visibility.
  const collection = process.env.CHROMA_COLLECTION || "chatsf_docs";
  const url = process.env.CHROMA_URL || "http://localhost:8000";
  const _ = getRequiredEnv; // keep import used pattern-friendly
  return { collection, url };
}

