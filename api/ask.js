import { getEmbedding } from '../utils/embed.js';
import { searchRelevantDocs } from '../utils/search.js';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  const { question } = req.query;

  if (!question) return res.status(400).json({ error: '質問がありません' });

  try {
    // 1. 質問をベクトル化
    const queryEmbedding = await getEmbedding(question);

    // 2. 類似ドキュメント検索（ここではモック）
    const contextText = await searchRelevantDocs(queryEmbedding);

    // 3. ChatGPT にプロンプトとして送信
    const chatCompletion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: '以下の情報に基づいて質問に答えてください：' + contextText },
        { role: 'user', content: question },
      ],
    });

    const answer = chatCompletion.data.choices[0].message.content;
    res.status(200).json({ answer });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}