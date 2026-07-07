import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { colors, card, logo } from "../styles"

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      style={{
      minHeight: "100vh",
      background: colors.bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      <style>{`
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
        ...card,
        width: "min(92vw, 560px)",
        padding: "2.2rem"
      }}>
        <div
          onClick={() => navigate("/")}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === "Enter" && navigate("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            width: "fit-content",
            margin: "0 auto 1.5rem",
            cursor: "pointer"
          }}
        >
          <div style={logo.wrapper}>
            <span style={{ fontSize: "16px" }}>🧠</span>
          </div>
          <span style={logo.text}>Biashara Brain</span>
        </div>

        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.78, 1, 0.78] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          style={{
          width: "84px", height: "84px", borderRadius: "50%",
          background: "rgba(139,175,110,0.1)",
          border: `1px solid rgba(139,175,110,0.5)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 1.8rem",
          boxShadow: "0 0 45px rgba(139,175,110,0.18)"
        }}>
          <span style={{ fontSize: "36px" }}>🧠</span>
        </motion.div>

        <h1 style={{
          color: colors.textPrimary,
          fontSize: "clamp(28px, 5vw, 36px)",
          fontWeight: "700", margin: "0 0 10px",
          letterSpacing: "-0.03em"
        }}>
          Building your business memory...
        </h1>
        <p style={{
          color: colors.textSecondary, fontSize: "16px",
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
    </motion.div>
  )
}