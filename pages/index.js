import Script from "next/script";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [responseCount, setResponseCount] = useState(0);

  const shareUrl = encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')
  const message = encodeURIComponent('煽りクソコメ生成AIでイラッとするコメントを生成してみた。')
  const hashtags = encodeURIComponent('煽りクソコメ,AI,おもしろWeb')

  const twitterUrl = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${message}&hashtags=${hashtags}`
  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${shareUrl}`

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
        
        {/* タイトル + シェアボタン（横並び） */}
        <div className="w-full max-w-xl mb-6 relative">
          <div className="flex justify-center items-center space-x-2">
            <img src="/ai-icon.png" alt="キャラ" className="w-10 h-10 rounded-full" />
            <span>煽りクソコメ生成AI</span>
          </div>
  
          <div className="absolute top-1 right-2 flex space-x-2">
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
            >
              X
            </a>
            <a
              href={lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
            >
              LINE
            </a>
          </div>
        </div>
  
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
  
        {/* 入力欄 */}
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
  
      {/* AdSense Script */}
      <Script
        strategy="afterInteractive"
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7289968025162748"
        crossOrigin="anonymous"
      />
    </>
  )
  
}