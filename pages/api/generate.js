import OpenAI from "openai";
import { toHiragana } from "wanakana";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;

  // ② トラップだけチェック用に正規化（GPTには使わない！）
  const promptNormalized = toHiragana(prompt.normalize("NFKC").toLowerCase());

  if (promptNormalized.includes("おまえがな")) {
    return res.status(200).json({ comment: "お前がな？w" });
  }

  // ③ GPTに送るプロンプト（元のまま）
  const stylePrompt = `あなたは煽りコメント生成AIです。

相手の発言に対する“イラッとする切り返しコメント”を1文で出力してください。

以下の条件をすべて満たすこと：
- コメントには皮肉・嘲笑・否定的リアクションを自然に含めること
- 5ch風ネットスラングや「w」「草」などの軽口を使ってもよい
- 回答は1文のみ、短くテンポよく返すこと
- 人ではなく“発言”のみを対象にすること（人格否定はNG）
- 暴力的・差別的・ヘイト的・性的な表現は禁止（OpenAIポリシーに従うこと）

出力は、1文だけにしてください。`;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: stylePrompt },
        { role: "user", content: prompt },
      ],
    });

    const comment = chatCompletion.choices[0].message.content;
    res.status(200).json({ comment });
  } catch (error) {
    console.error("OpenAI API error:", error.message);
    res.status(500).json({ error: "AIの生成に失敗しました" });
  }
}
