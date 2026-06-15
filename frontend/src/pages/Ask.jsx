import { useState } from "react"

const SUGGESTED = [
  "What projects am I currently working on?",
  "Who are my important customers?",
  "Summarise my business.",
  "What should I follow up on?"
]

export default function Ask() {
  const [question, setQuestion] = useState("")
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const business_id = localStorage.getItem("business_id")
  const business_name = localStorage.getItem("business_name")

  const ask = async (q) => {
    const query = q || question
    if (!query.trim()) return
    setMessages(prev => [...prev, { role: "user", text: query }])
    setQuestion("")
    setLoading(true)
    try {
      const res = await fetch("http://127.0.0.1:8000/memory/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business_id, question: query })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: "agent", text: data.answer }])
    } catch {
      setMessages(prev => [...prev, { role: "agent", text: "Something went wrong. Please try again." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0D0D0D",
      display: "flex",
      flexDirection: "column",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>

      <div style={{
        padding: "1rem 1.5rem",
        borderBottom: "0.5px solid #1A1A1A",
        display: "flex", alignItems: "center", gap: "10px"
      }}>
        <div style={{
          width: "28px", height: "28px", borderRadius: "6px",
          background: "#1C1C1C", border: "0.5px solid #2A2A2A",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <span style={{ fontSize: "14px" }}>🧠</span>
        </div>
        <span style={{ color: "#FFFFFF", fontSize: "14px", fontWeight: "500" }}>Biashara Brain</span>
        <span style={{ color: "#3A3A3A", fontSize: "14px", marginLeft: "4px" }}>—</span>
        <span style={{ color: "#6B6B6B", fontSize: "14px" }}>{business_name}</span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "12px" }}>

        {messages.length === 0 && (
          <div style={{ margin: "auto", textAlign: "center", maxWidth: "380px" }}>
            <p style={{ color: "#FFFFFF", fontSize: "18px", fontWeight: "500", margin: "0 0 8px", letterSpacing: "-0.02em" }}>
              What would you like to know?
            </p>
            <p style={{ color: "#6B6B6B", fontSize: "13px", margin: "0 0 2rem", lineHeight: "1.6" }}>
              Ask anything about your business. I remember everything.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {SUGGESTED.map((s, i) => (
                <button
                  key={i}
                  onClick={() => ask(s)}
                  style={{
                    background: "#1A1A1A", border: "0.5px solid #2A2A2A",
                    borderRadius: "8px", padding: "10px 14px",
                    color: "#888888", fontSize: "13px", cursor: "pointer",
                    textAlign: "left"
                  }}
                  onMouseEnter={e => e.target.style.borderColor = "#3A4A2A"}
                  onMouseLeave={e => e.target.style.borderColor = "#2A2A2A"}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{
            display: "flex",
            flexDirection: "column",
            alignItems: msg.role === "user" ? "flex-end" : "flex-start"
          }}>
            <p style={{
              fontSize: "11px", color: "#3A3A3A",
              margin: "0 0 4px",
              paddingLeft: msg.role === "agent" ? "4px" : 0,
              paddingRight: msg.role === "user" ? "4px" : 0
            }}>
              {msg.role === "user" ? "You" : "Biashara Brain"}
            </p>
            <div style={{
              maxWidth: "75%",
              background: msg.role === "user" ? "#1A1A1A" : "#111",
              border: msg.role === "user" ? "0.5px solid #2A2A2A" : "0.5px solid #1E2A18",
              borderRadius: "8px",
              padding: "10px 14px"
            }}>
              <p style={{
                color: msg.role === "user" ? "#CCCCCC" : "#BBBBBB",
                fontSize: "14px", margin: 0, lineHeight: "1.7"
              }}>
                {msg.text}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
            <div style={{
              background: "#111", border: "0.5px solid #1E2A18",
              borderRadius: "8px", padding: "10px 14px"
            }}>
              <p style={{ color: "#4A5C3A", fontSize: "14px", margin: 0 }}>Thinking...</p>
            </div>
          </div>
        )}

      </div>

      <div style={{
        padding: "1rem 1.5rem",
        borderTop: "0.5px solid #1A1A1A",
        display: "flex", gap: "8px"
      }}>
        <input
          type="text"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => e.key === "Enter" && ask()}
          placeholder="Ask anything about your business..."
          style={{
            flex: 1, background: "#1A1A1A",
            border: "0.5px solid #2A2A2A", borderRadius: "8px",
            padding: "11px 14px", color: "#FFFFFF", fontSize: "14px",
            outline: "none",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          }}
        />
        <button
          onClick={() => ask()}
          style={{
            background: "#1A1A1A", border: "0.5px solid #3A4A2A",
            borderRadius: "8px", padding: "11px 16px",
            color: "#A8C080", fontSize: "14px",
            cursor: "pointer", fontWeight: "500"
          }}
          onMouseEnter={e => e.target.style.background = "#222"}
          onMouseLeave={e => e.target.style.background = "#1A1A1A"}
        >
          →
        </button>
      </div>

    </div>
  )
}