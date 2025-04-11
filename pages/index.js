import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [responseCount, setResponseCount] = useState(0);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    const newLog = [...chatLog, { sender: "user", text: input }];
    setChatLog(newLog);
    setInput("");

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input }),
    });

    const data = await res.json();
    const botReply = { sender: "bot", text: data.comment };

    const updatedLog = [...newLog, botReply];
    const newCount = responseCount + 1;
    setResponseCount(newCount);

    setChatLog(updatedLog);
  };

  return (
    <>
      <div className="min-h-screen bg-[#fef6e4] font-sans flex flex-col items-center py-8 text-[#5b3a29]">
        <h1 className="text-2xl font-bold text-[#8b5e3c] mb-4 flex items-center space-x-2">
          <img src="/ai-icon.png" alt="キャラ" className="w-14 h-14 rounded-full" />
          <span>煽りクソコメ生成AI</span>
        </h1>

        {/* チャット画面 */}
        <div className="w-full max-w-xl bg-[#fffaf0] rounded shadow p-4 space-y-3 overflow-y-auto h-[500px] border border-[#d6a77a]">
          {chatLog.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start space-x-2 ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "bot" && (
                <img src="/ai-icon.png" alt="AI" className="w-8 h-8 rounded-full" />
              )}
              <div
                className={`px-4 py-2 rounded-xl shadow max-w-xs ${
                  msg.sender === "user"
                    ? "bg-[#d4a373] text-white text-right"
                    : "bg-[#f5e0c3] text-gray-800 text-left"
                }`}
              >
                {msg.text.includes("http") ? (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: msg.text.replace(
                        /\[(.*?)\]\((.*?)\)/g,
                        '<a href="$2" target="_blank" rel="noopener noreferrer" class="underline text-blue-600 hover:text-blue-800">$1</a>'
                      ),
                    }}
                  />
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))}

          {/* 3回に1回広告表示 */}
          {responseCount > 0 && responseCount % 3 === 0 && (
            <div className="w-full bg-white border border-gray-300 rounded p-4 text-center shadow mt-4">
              <ins
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client="ca-pub-7289968025162748"
                data-ad-slot="1234567890"
                data-ad-format="auto"
                data-full-width-responsive="true"
              ></ins>
              <script
                dangerouslySetInnerHTML={{
                  __html: `(adsbygoogle = window.adsbygoogle || []).push({});`,
                }}
              />
            </div>
          )}
        </div>

        {/* 入力欄と送信UI */}
        <div className="w-full max-w-xl mt-4 space-y-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="煽ってほしい内容を入力"
            className="w-full border border-[#d4a373] rounded p-2 bg-[#fffdf5] text-[#5b3a29]"
            rows={2}
          />
          <div className="flex items-center justify-end">
            <button
              onClick={handleSubmit}
              className="bg-[#b08968] hover:bg-[#9c7353] text-white px-4 py-2 rounded"
            >
              生成
            </button>
          </div>
        </div>
      </div>

      {/* ページ最下部の AdSense スクリプト（クローラ用） */}
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7289968025162748"
        crossOrigin="anonymous"
      />
    </>
  );
}
