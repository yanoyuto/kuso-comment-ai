import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, style, intensity } = req.body;

  const stylePrompt = {
    "5ch風": "5chのスレに書かれていそうな、短く攻撃的でネタっぽい煽り口調でコメントしてください。",
    "毒舌風": "まるで辛口評論家のように、ストレートに毒舌なコメントをしてください。",
    "冷静な皮肉": "一見丁寧で冷静に見えるが、じわじわ刺さる皮肉を含んだコメントにしてください。",
  }[style] || "煽りコメントを作ってください。";

  const intensityPrompt = `煽り強度は ${intensity}/10 で調整してください。`;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: stylePrompt },
        { role: "user", content: `${prompt}\n\n${intensityPrompt}` },
      ],
    });

    const comment = chatCompletion.choices[0].message.content;
    res.status(200).json({ comment });
  } catch (error) {
    console.error("OpenAI API error:", error.message);
    res.status(500).json({ error: "AIの生成に失敗しました" });
  }
}
