import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Xin chào! Mình là SolarBot với công nghệ RAG và NASA API. Mình có thể trả lời về hệ Mặt Trời, vũ trụ, và cả chương trình vũ trụ Việt Nam! Hỏi mình bất cứ điều gì nhé! 🚀🇻🇳" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const listRef = useRef(null);

  // Suggested questions with Vietnam content
  const suggestedQuestions = [
    "Sao Hỏa có gì đặc biệt?",
    "Việt Nam có vệ tinh nào?", 
    "Phạm Tuân là ai?",
    "Hố đen hoạt động như thế nào?",
    "Lịch âm Việt Nam ra sao?",
    "Có thiên thạch nào bay qua Trái Đất hôm nay không?",
    "VNREDSat-1 là gì?",
    "Sao Mai và Sao Hôm khác nhau thế nào?"
  ];

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading]);

  async function sendMessage(messageText = null) {
    const messageToSend = messageText || input.trim();
    if (!messageToSend) return;

    const userMsg = { role: "user", text: messageToSend };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    setShowSuggestions(false); // Hide suggestions after first message

    try {
      const resp = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageToSend }),
      });

      const data = await resp.json();
      const botText = data?.reply || "Mình không có câu trả lời.";
      const sources = data?.sources || [];
      const method = data?.method || 'unknown';
      const contextsUsed = data?.contextsUsed || 0;
      
      setMessages((m) => [...m, { 
        role: "bot", 
        text: botText, 
        sources,
        metadata: { method, contextsUsed }
      }]);
    } catch (e) {
      setMessages((m) => [...m, { role: "bot", text: "Lỗi server hoặc API. Đảm bảo backend đang chạy trên port 3001." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          zIndex: 9998,
          transition: 'all 0.3s ease'
        }}
        title="Chat with SolarBot"
      >
        {isOpen ? '✕' : '🤖'}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              position: 'fixed',
              bottom: '100px',
              right: '24px',
              width: '380px',
              maxHeight: '600px',
              background: 'rgba(10, 14, 39, 0.98)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              border: '2px solid rgba(102, 126, 234, 0.3)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
              zIndex: 9997,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '20px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 style={{
                margin: 0,
                color: '#fff',
                fontSize: '18px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                🚀 SolarBot
                <span style={{
                  fontSize: '10px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontWeight: '500'
                }}>
                  RAG + AI
                </span>
              </h3>
              <p style={{
                margin: '4px 0 0 0',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '12px'
              }}>
                Hỏi mình về vũ trụ nhé!
              </p>
            </div>

            {/* Messages */}
            <div
              ref={listRef}
              style={{
                flex: 1,
                padding: '16px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    display: 'flex',
                    justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                    flexDirection: "column",
                    alignItems: m.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "85%",
                      background: m.role === "user"
                        ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                        : "rgba(255, 255, 255, 0.08)",
                      padding: "10px 14px",
                      borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                      whiteSpace: "pre-wrap",
                      color: '#fff',
                      fontSize: '14px',
                      lineHeight: '1.5'
                    }}
                  >
                    {m.text}
                  </div>
                  {m.metadata && m.role === "bot" && (
                    <div style={{
                      marginTop: 4,
                      fontSize: 11,
                      color: "#666",
                      fontStyle: "italic",
                      maxWidth: "85%"
                    }}>
                      🤖 Method: {m.metadata.method} | Contexts: {m.metadata.contextsUsed}
                    </div>
                  )}
                  {m.sources && m.sources.length > 0 && (
                    <div style={{
                      marginTop: 6,
                      fontSize: 11,
                      color: "#888",
                      maxWidth: "85%"
                    }}>
                      📡 Nguồn: {m.sources.map(s => s.source || s.name).join(", ")}
                    </div>
                  )}
                </motion.div>
              ))}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    color: '#888',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    ⚙️
                  </motion.span>
                  Đang suy nghĩ...
                </motion.div>
              )}
              
              {/* Suggested Questions */}
              {showSuggestions && messages.length === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    marginTop: '16px'
                  }}
                >
                  <p style={{ 
                    color: '#888', 
                    fontSize: '12px', 
                    margin: 0,
                    textAlign: 'center'
                  }}>
                    💡 Gợi ý câu hỏi:
                  </p>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                    justifyContent: 'center'
                  }}>
                    {suggestedQuestions.slice(0, 6).map((question, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => sendMessage(question)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '12px',
                          padding: '6px 10px',
                          color: '#fff',
                          fontSize: '11px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {question}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div style={{
              padding: '16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(0, 0, 0, 0.2)'
            }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  placeholder="Nhập câu hỏi..."
                  disabled={loading}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  style={{
                    padding: "10px 16px",
                    borderRadius: '12px',
                    background: loading || !input.trim()
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    color: '#fff',
                    fontWeight: '600',
                    cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                    fontSize: '14px'
                  }}
                >
                  {loading ? '⏳' : '📤'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
