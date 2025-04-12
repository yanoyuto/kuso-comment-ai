import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, style } = req.body; // ← intensityはもう受け取らない！

  const stylePrompt = `相手の発言に対し、皮肉・嘲笑・否定を含むムカつく短文で返してください。
  ネットスラングOK。暴力・差別・属性侮辱は禁止。
  1文のみで鋭く。人じゃなく発言を攻撃。`;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or "gpt-4" if使用可能
      messages: [
        { role: "system", content: stylePrompt },
        { role: "user", content: prompt }, // intensityPrompt 削除！
      ],
    });

    const comment = chatCompletion.choices[0].message.content;
    res.status(200).json({ comment });
  } catch (error) {
    console.error("OpenAI API error:", error.message);
    res.status(500).json({ error: "AIの生成に失敗しました" });
  }
}