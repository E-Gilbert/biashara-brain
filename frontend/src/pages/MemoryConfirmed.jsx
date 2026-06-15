import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function MemoryConfirmed() {
  const navigate = useNavigate()
  const [memories, setMemories] = useState([])

  useEffect(() => {
    const raw = localStorage.getItem("extracted_memories")
    if (!raw) return
    try {
      const cleaned = raw.replace(/```json|```/g, "").trim()
      const parsed = JSON.parse(cleaned)
      setMemories(Array.isArray(parsed) ? parsed : [])
    } catch {
      setMemories(["Your business information has been saved."])
    }
  }, [])

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0D0D0D",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      <div style={{ width: "100%", maxWidth: "480px" }}>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "3rem" }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "8px",
            background: "#1C1C1C", border: "0.5px solid #2A2A2A",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <span style={{ fontSize: "16px" }}>🧠</span>
          </div>
          <span style={{ color: "#FFFFFF", fontSize: "15px", fontWeight: "500", letterSpacing: "-0.01em" }}>Biashara Brain</span>
        </div>

        <h1 style={{
          color: "#FFFFFF", fontSize: "26px", fontWeight: "500",
          margin: "0 0 8px", letterSpacing: "-0.02em", lineHeight: "1.3"
        }}>
          I've remembered:
        </h1>
        <p style={{ color: "#6B6B6B", fontSize: "14px", margin: "0 0 2rem", lineHeight: "1.6" }}>
          Here's what I now know about your business.
        </p>

        <div style={{
          background: "#1A1A1A",
          border: "0.5px solid #2A2A2A",
          borderRadius: "8px",
          padding: "1.25rem",
          marginBottom: "2rem"
        }}>
          {memories.length === 0 ? (
            <p style={{ color: "#6B6B6B", fontSize: "14px", margin: 0 }}>Processing your memories...</p>
          ) : (
            memories.map((mem, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start",
                gap: "10px", marginBottom: i < memories.length - 1 ? "12px" : 0
              }}>
                <span style={{ color: "#A8C080", fontSize: "14px", marginTop: "1px", flexShrink: 0 }}>✓</span>
                <p style={{ color: "#CCCCCC", fontSize: "14px", margin: 0, lineHeight: "1.6" }}>{mem}</p>
              </div>
            ))
          )}
        </div>

        <button
          onClick={() => navigate("/ask")}
          style={{
            width: "100%", background: "#1A1A1A",
            border: "0.5px solid #3A4A2A", borderRadius: "8px",
            padding: "12px", color: "#A8C080", fontSize: "14px",
            fontWeight: "500", cursor: "pointer", letterSpacing: "-0.01em"
          }}
          onMouseEnter={e => e.target.style.background = "#222"}
          onMouseLeave={e => e.target.style.background = "#1A1A1A"}
        >
          Start asking questions →
        </button>

      </div>
    </div>
  )
}