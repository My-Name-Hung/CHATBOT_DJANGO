export interface VectorDocument {
  id: string;
  text: string;
  metadata: Record<string, unknown>;
  embedding: number[];
}

export interface VectorSearchResult {
  id: string;
  score: number;
  text: string;
  metadata: Record<string, unknown>;
}

export interface VectorAdapter {
  init(): Promise<void>;
  addDocuments(docs: VectorDocument[]): Promise<void>;
  search(queryEmbedding: number[], k: number): Promise<VectorSearchResult[]>;
  clear(): Promise<void>;
}

