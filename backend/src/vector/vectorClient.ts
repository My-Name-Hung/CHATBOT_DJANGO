import type { VectorAdapter } from "./vectorTypes.js";
import { ChromaAdapter } from "./chromaAdapter.js";

let adapter: VectorAdapter | null = null;

export async function getVectorAdapter(): Promise<VectorAdapter> {
  if (adapter) return adapter;
  adapter = new ChromaAdapter();
  await adapter.init();
  return adapter;
}

