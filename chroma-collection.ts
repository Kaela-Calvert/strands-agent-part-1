import { ChromaClient } from 'chromadb';
import { GoogleGeminiEmbeddingFunction } from '@chroma-core/google-gemini';

const client = new ChromaClient();

const getCollection = async (collectionName: string) => {
  const collection = await client.getOrCreateCollection({
    name: collectionName,
    embeddingFunction: new GoogleGeminiEmbeddingFunction({
      apiKey: process.env.GEMINI_API_KEY!,
      modelName: 'gemini-embedding-001',
    }),
  });
  return collection;
};

export default getCollection;
