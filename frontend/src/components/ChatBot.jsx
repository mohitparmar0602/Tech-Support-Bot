import React, { useState } from "react";
import axios from "axios";

const ChatBot = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:5000/ask", { query });
      setResponse(res.data.response);
    } catch (error) {
      setResponse([{ title: "Error fetching response", link: "" }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Tech Support Bot</h2>
      <input
        type="text"
        placeholder="Ask a tech question..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleAsk} disabled={loading}>
        {loading ? "Searching..." : "Ask"}
      </button>

      <div>
        {response.length > 0 && (
          <ul>
            {response.map((item, index) => (
              <li key={index}>
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChatBot;
