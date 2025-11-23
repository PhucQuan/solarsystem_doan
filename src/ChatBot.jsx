import React, { useState, useRef, useEffect } from "react";

export default function ChatBot() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Xin chào! Mình là SolarBot với NASA API. Hỏi mình về hệ Mặt Trời, thiên thạch, sao Hỏa, hay bất cứ điều gì về vũ trụ nhé!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading]);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const resp = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await resp.json();
      const botText = data?.reply || "Mình không có câu trả lời.";
      const sources = data?.sources || [];
      setMessages((m) => [...m, { role: "bot", text: botText, sources }]);
    } catch (e) {
      setMessages((m) => [...m, { role: "bot", text: "Lỗi server hoặc API." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: 20 }}>
      <h2 style={{ marginBottom: 12 }}>🚀 SolarBot với NASA API</h2>

      <div
        ref={listRef}
        style={{
          border: "1px solid #ddd",
          padding: 12,
          minHeight: 320,
          maxHeight: 420,
          overflowY: "auto",
          borderRadius: 8,
          background: "#fff",
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              marginBottom: 12,
              flexDirection: "column",
              alignItems: m.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "80%",
                background: m.role === "user" ? "#d0edff" : "#f1f1f1",
                padding: "8px 12px",
                borderRadius: 12,
                boxShadow: "0 1px 0 rgba(0,0,0,0.04)",
                whiteSpace: "pre-wrap",
              }}
            >
              {m.text}
            </div>
            {m.sources && m.sources.length > 0 && (
              <div style={{ marginTop: 6, fontSize: 11, color: "#666", maxWidth: "80%" }}>
                📡 Nguồn: {m.sources.map(s => s.source || s.name).join(", ")}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div style={{ marginTop: 8 }}>Gemini/Groq đang suy nghĩ...</div>
        )}
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
          style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
          placeholder="Nhập câu hỏi..."
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()} style={{ padding: "8px 14px", borderRadius: 8 }}>
          Gửi
        </button>
      </div>
    </div>
  );
}
