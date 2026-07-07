import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { colors, logo } from "../styles"

export default function Processing() {
  const navigate = useNavigate()
  const location = useLocation()
  const content = location.state?.content || ""

  useEffect(() => {
    const extractMemories = async () => {
      const business_id = localStorage.getItem("business_id")
      try {
        const res = await fetch("https://biasharabrain.up.railway.app/memory/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            business_id,
            question: `Extract the key facts from this business description as a JSON array of short strings. Each string should be one clear fact. Return only a JSON array, nothing else. Description: ${content}`
          })
        })
        const data = await res.json()
        localStorage.setItem("extracted_memories", data.answer)
      } catch {
        localStorage.setItem("extracted_memories", "[]")
      } finally {
        setTimeout(() => navigate("/confirmed"), 3000)
      }
    }
    extractMemories()
  }, [])

  return (
    <div style={{
      minHeight: "100vh",
      background: colors.bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
        }
      `}</style>

      <div style={{
        textAlign: "center",
        animation: "fadeIn 0.4s ease"
      }}>
        <div style={{
          width: "72px", height: "72px", borderRadius: "50%",
          background: colors.surface,
          border: `0.5px solid ${colors.borderGreen}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 1.5rem",
          animation: "breathe 2s ease-in-out infinite"
        }}>
          <span style={{ fontSize: "30px" }}>🧠</span>
        </div>

        <h1 style={{
          color: colors.textPrimary,
          fontSize: "clamp(18px, 4vw, 22px)",
          fontWeight: "500", margin: "0 0 8px",
          letterSpacing: "-0.02em"
        }}>
          Building your business memory...
        </h1>
        <p style={{
          color: colors.textSecondary, fontSize: "14px",
          margin: "0 0 2rem"
        }}>
          Reading, structuring, remembering.
        </p>

        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: colors.accent,
              animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`
            }} />
          ))}
        </div>
      </div>
    </div>
  )
}