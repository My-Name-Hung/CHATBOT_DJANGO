import type {
  VectorAdapter,
  VectorDocument,
  VectorSearchResult
} from "./vectorTypes.js";

export class PineconeAdapter implements VectorAdapter {
  async init(): Promise<void> {
    // TODO: implement when you enable Pinecone
  }

  async addDocuments(_docs: VectorDocument[]): Promise<void> {
    throw new Error("Pinecone adapter not implemented");
  }

  async search(_queryEmbedding: number[], _k: number): Promise<VectorSearchResult[]> {
    throw new Error("Pinecone adapter not implemented");
  }

  async clear(): Promise<void> {
    throw new Error("Pinecone adapter not implemented");
  }
}

