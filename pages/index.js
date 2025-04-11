import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [style, setStyle] = useState("5ch風");
  const [chatLog, setChatLog] = useState([]);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    // ユーザーの発言を追加
    const newLog = [...chatLog, { sender: "user", text: input }];
    setChatLog(newLog);
    setInput(""); // 入力クリア

    // AIに送信
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input, style }),
    });

    const data = await res.json();

    // AIの返答を追加
    setChatLog([...newLog, { sender: "bot", text: data.comment }]);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <h1 className="text-2xl font-bold text-purple-700 mb-4">煽りクソコメ生成AI</h1>

      {/* チャット画面 */}
      <div className="w-full max-w-xl bg-white rounded shadow p-4 space-y-3 overflow-y-auto h-[500px]">
        {chatLog.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-xs ${
                msg.sender === "user"
                  ? "bg-purple-200 text-right"
                  : "bg-gray-200 text-left"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* 入力欄と送信UI */}
      <div className="w-full max-w-xl mt-4 space-y-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="入力"
          className="w-full border rounded p-2"
          rows={2}
        />

        <div className="flex items-center space-x-4">
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="border rounded p-2 flex-1"
          >
            <option value="5ch風">5ch風</option>
            <option value="毒舌風">毒舌風</option>
            <option value="冷静な皮肉">冷静な皮肉</option>
          </select>
          <button
            onClick={handleSubmit}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
          >
            生成
          </button>
        </div>
      </div>
    </div>
  );
}