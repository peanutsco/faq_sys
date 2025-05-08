import OpenAI from "openai";
import { findRelevantContext } from "../utils/search.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  try {
    const { question } = req.query;
    if (!question) return res.status(400).json({ error: "question is required" });

    const context = await findRelevantContext(question);
    const prompt = `以下の情報に基づいて質問に答えてください。\n\n${context}\n\n質問: ${question}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2
    });

    res.status(200).json({ answer: completion.choices[0].message.content });
  } catch (e) {
    console.error("API error:", e);
    res.status(500).json({ error: e.message });
  }
}