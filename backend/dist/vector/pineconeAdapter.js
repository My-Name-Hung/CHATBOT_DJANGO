export class PineconeAdapter {
    async init() {
        // TODO: implement when you enable Pinecone
    }
    async addDocuments(_docs) {
        throw new Error("Pinecone adapter not implemented");
    }
    async search(_queryEmbedding, _k) {
        throw new Error("Pinecone adapter not implemented");
    }
    async clear() {
        throw new Error("Pinecone adapter not implemented");
    }
}
