import fs from "fs";
import path from "path";
import { getEmbedding } from "./embed.js";

const DOC_PATH = path.join(process.cwd(), "data", "docs.json");

function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0);
  const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (normA * normB);
}

export async function findRelevantContext(query) {
  const docs = JSON.parse(fs.readFileSync(DOC_PATH, "utf-8"));
  const queryEmbedding = await getEmbedding(query);

  const scoredDocs = docs.map(doc => ({
    ...doc,
    score: cosineSimilarity(queryEmbedding, doc.embedding)
  }));

  scoredDocs.sort((a, b) => b.score - a.score);
  return scoredDocs.slice(0, 3).map(doc => doc.text).join("\n\n");
}