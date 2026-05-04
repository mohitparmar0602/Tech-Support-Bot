import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const ChatBot = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    { role: "bot", content: "Hello! I'm your Tech Support AI. How can I help you today?", references: [] }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleAsk = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim() || loading) return;

    const userMessage = { role: "user", content: query };
    setMessages((prev) => [...prev, userMessage]);
    setQuery("");
    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:5000/ask", { query });
      const botMessage = { 
        role: "bot", 
        content: res.data.response, 
        references: res.data.references || [] 
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [...prev, { 
        role: "bot", 
        content: "Sorry, I'm having trouble connecting to the server. Please make sure the backend is running.",
        references: []
      }]);
    }
    setLoading(false);
  };

  return (
    <div className="app-container">
      <div className="glass-card">
        {/* Header */}
        <div style={{ 
          padding: "20px 24px", 
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }}>
          <div style={{ 
            width: "12px", 
            height: "12px", 
            borderRadius: "50%", 
            backgroundColor: "#22c55e",
            boxShadow: "0 0 10px #22c55e"
          }}></div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#f8fafc" }}>
            Tech Support Bot
          </h2>
        </div>

        {/* Chat Area */}
        <div style={{ 
          flex: 1, 
          overflowY: "auto", 
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}>
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className="fade-in"
              style={{ 
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "85%",
                display: "flex",
                flexDirection: "column",
                gap: "8px"
              }}
            >
              <div style={{ 
                padding: "12px 18px", 
                borderRadius: msg.role === "user" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                backgroundColor: msg.role === "user" ? "#8b5cf6" : "rgba(255,255,255,0.05)",
                border: msg.role === "user" ? "none" : "1px solid rgba(255, 255, 255, 0.1)",
                color: "white",
                fontSize: "0.95rem",
                lineHeight: "1.5",
                whiteSpace: "pre-wrap"
              }}>
                {msg.content}
              </div>
              
              {msg.references && msg.references.length > 0 && (
                <div style={{ 
                  marginTop: "4px",
                  padding: "12px",
                  borderRadius: "12px",
                  backgroundColor: "rgba(34, 211, 238, 0.05)",
                  border: "1px solid rgba(34, 211, 238, 0.2)"
                }}>
                  <p style={{ fontSize: "0.75rem", color: "#22d3ee", fontWeight: "600", marginBottom: "8px", textTransform: "uppercase" }}>
                    Helpful Links
                  </p>
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
                    {msg.references.map((link, i) => (
                      <li key={i}>
                        <a 
                          href={link.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ 
                            fontSize: "0.85rem", 
                            color: "#f8fafc", 
                            textDecoration: "none",
                            display: "block",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            opacity: 0.8
                          }}
                        >
                          🔗 {link.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
          
          {loading && (
            <div style={{ 
              alignSelf: "flex-start",
              padding: "12px 18px",
              borderRadius: "20px 20px 20px 4px",
              backgroundColor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              display: "flex",
              gap: "4px"
            }}>
              <div className="pulse-dot"></div>
              <div className="pulse-dot" style={{ animationDelay: "0.2s" }}></div>
              <div className="pulse-dot" style={{ animationDelay: "0.4s" }}></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form 
          onSubmit={handleAsk}
          style={{ 
            padding: "24px", 
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            display: "flex",
            gap: "12px"
          }}
        >
          <input
            type="text"
            placeholder="Ask a tech question..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ 
              flex: 1, 
              padding: "14px 20px", 
              borderRadius: "14px", 
              border: "1px solid rgba(255, 255, 255, 0.1)", 
              backgroundColor: "rgba(0,0,0,0.2)",
              color: "white",
              outline: "none",
              fontSize: "0.95rem"
            }}
          />
          <button 
            type="submit"
            disabled={loading || !query.trim()}
            style={{ 
              padding: "0 24px", 
              borderRadius: "14px", 
              backgroundColor: "#8b5cf6", 
              color: "white", 
              border: "none", 
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
              opacity: (loading || !query.trim()) ? 0.5 : 1
            }}
          >
            Send
          </button>
        </form>
      </div>
      <style>{`
        .pulse-dot {
          width: 6px;
          height: 6px;
          borderRadius: 50%;
          background: white;
          animation: pulse 1s infinite;
        }
        @keyframes pulse {
          0% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 0.3; transform: scale(0.8); }
        }
      `}</style>
    </div>
  );
};

export default ChatBot;
