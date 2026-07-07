import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { colors, button, logo } from "../styles"

export default function MemoryConfirmed() {
  const navigate = useNavigate()
  const [memories, setMemories] = useState([])
  const [visible, setVisible] = useState([])

  useEffect(() => {
    const raw = localStorage.getItem("extracted_memories")
    if (!raw) return
    try {
      const cleaned = raw.replace(/```json|```/g, "").trim()
      const parsed = JSON.parse(cleaned)
      const list = Array.isArray(parsed) ? parsed : ["Your business information has been saved."]
      setMemories(list)
      list.forEach((_, i) => {
        setTimeout(() => setVisible(prev => [...prev, i]), i * 300)
      })
    } catch {
      setMemories(["Your business information has been saved."])
      setVisible([0])
    }
  }, [])

  return (
    <div style={{
      minHeight: "100vh",
      background: colors.bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1.5rem",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      animation: "fadeIn 0.4s ease"
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .btn-primary:hover { background: #222222 !important; }
        .btn-primary:active { transform: scale(0.98); }
      `}</style>

      <div style={{ width: "100%", maxWidth: "480px" }}>

        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          marginBottom: "3rem", animation: "fadeIn 0.5s ease 0.1s both"
        }}>
          <div style={logo.wrapper}>
            <span style={{ fontSize: "16px" }}>🧠</span>
          </div>
          <span style={logo.text}>Biashara Brain</span>
        </div>

        <div style={{ animation: "fadeIn 0.5s ease 0.2s both" }}>
          <h1 style={{
            color: colors.textPrimary,
            fontSize: "clamp(20px, 5vw, 26px)",
            fontWeight: "500", margin: "0 0 8px",
            letterSpacing: "-0.02em", lineHeight: "1.3"
          }}>
            I've remembered:
          </h1>
          <p style={{
            color: colors.textSecondary, fontSize: "14px",
            margin: "0 0 2rem", lineHeight: "1.6"
          }}>
            Here's what I now know about your business.
          </p>
        </div>

        <div style={{
          background: colors.surface,
          border: `0.5px solid ${colors.border}`,
          borderRadius: "8px", padding: "1.25rem",
          marginBottom: "2rem"
        }}>
          {memories.length === 0 ? (
            <p style={{ color: colors.textSecondary, fontSize: "14px", margin: 0 }}>
              Processing your memories...
            </p>
          ) : (
            memories.map((mem, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: "10px",
                marginBottom: i < memories.length - 1 ? "14px" : 0,
                opacity: visible.includes(i) ? 1 : 0,
                animation: visible.includes(i) ? "slideIn 0.4s ease forwards" : "none",
                transition: "opacity 0.3s"
              }}>
                <span style={{
                  color: colors.accent, fontSize: "14px",
                  marginTop: "1px", flexShrink: 0
                }}>✓</span>
                <p style={{
                  color: "#CCCCCC", fontSize: "14px",
                  margin: 0, lineHeight: "1.6"
                }}>{mem}</p>
              </div>
            ))
          )}
        </div>

        <button
          className="btn-primary"
          onClick={() => navigate("/ask")}
          style={{
            ...button,
            animation: "fadeIn 0.5s ease 0.4s both",
            transition: "background 0.2s, transform 0.1s"
          }}
        >
          Start asking questions →
        </button>

      </div>
    </div>
  )
}