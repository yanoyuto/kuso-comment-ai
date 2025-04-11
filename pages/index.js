import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [style, setStyle] = useState("5ch風");
  const [intensity, setIntensity] = useState(5);
  const [result, setResult] = useState("");

  const handleSubmit = async () => {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input, style, intensity }),
    });
    const data = await res.json();
    setResult(data.comment);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-purple-700">
        煽りクソコメ生成AI
      </h1>

      <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-6">
        {/* 入力欄 */}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="煽ってほしい内容を入力してください"
          className="w-full border border-gray-300 rounded p-3"
          rows={4}
        />

        {/* スタイル選択 */}
        <div>
          <label className="block font-semibold mb-1">スタイル:</label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
          >
            <option value="5ch風">5ch風</option>
            <option value="毒舌風">毒舌風</option>
            <option value="冷静な皮肉">冷静な皮肉</option>
          </select>
        </div>

        {/* 煽り強度スライダー */}
        <div>
          <label className="block font-semibold mb-1">
            煽り強度: {intensity}/10
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* 生成ボタン */}
        <button
          onClick={handleSubmit}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
        >
          生成する
        </button>

        {/* 出力コメント */}
        {result && (
          <div className="mt-6 border-t pt-4 text-gray-800">
            <h2 className="font-semibold text-lg mb-2">生成されたクソコメ:</h2>
            <p className="whitespace-pre-line">{result}</p>
          </div>
        )}
      </div>
    </div>
  );
}

