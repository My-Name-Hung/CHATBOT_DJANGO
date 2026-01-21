import { ChromaAdapter } from "./chromaAdapter.js";
let adapter = null;
export async function getVectorAdapter() {
    if (adapter)
        return adapter;
    adapter = new ChromaAdapter();
    await adapter.init();
    return adapter;
}
