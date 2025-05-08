// 🔧 簡易ベクトル検索：JSONファイル or Supabaseなどを利用可能

import fs from 'fs';
import path from 'path';

// ダミーデータ読み込み（実際はSupabaseやPineconeに置き換え）
const dataPath = path.resolve(process.cwd(), 'data/docs.json');
const documents = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

export async function searchRelevantDocs(queryEmbedding) {
  // 超簡易なコサイン類似度計算（高速化・最適化は別途）
  let bestDoc = documents[0];
  let bestScore = -1;
  for (const doc of documents) {
    const dot = doc.embedding.reduce((sum, val, i) => sum + val * queryEmbedding[i], 0);
    if (dot > bestScore) {
      bestScore = dot;
      bestDoc = doc;
    }
  }
  return bestDoc.text;
}
