import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { colors, button, logo, card } from "../styles"

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
      padding: "2rem",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      position: "relative"
    }}>
      <style>{`
      `}</style>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.08, duration: 0.5 }}
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(60% 45% at 70% 5%, rgba(139,175,110,0.1) 0%, rgba(8,8,8,0) 100%)"
        }}
      />

      <div style={{ width: "100%", maxWidth: "720px", zIndex: 1 }}>

        <div
          onClick={() => navigate("/")}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === "Enter" && navigate("/")}
          style={{
          display: "flex", alignItems: "center", gap: "10px",
          marginBottom: "2rem",
          cursor: "pointer",
          width: "fit-content"
        }}>
          <div style={logo.wrapper}>
            <span style={{ fontSize: "16px" }}>🧠</span>
          </div>
          <span style={logo.text}>Biashara Brain</span>
        </div>

        <div style={{ ...card }}>
          <h1 style={{
            color: colors.textPrimary,
            fontSize: "clamp(30px, 6vw, 42px)",
            fontWeight: "700", margin: "0 0 10px",
            letterSpacing: "-0.035em", lineHeight: "1.1"
          }}>
            I've remembered:
          </h1>
          <p style={{
            color: colors.textSecondary, fontSize: "16px",
            margin: "0 0 2rem", lineHeight: "1.6"
          }}>
            Here's what I now know about your business.
          </p>

          <div style={{
          background: colors.surface2,
          border: `1px solid ${colors.border}`,
          borderRadius: "14px", padding: "1.25rem",
          marginBottom: "1.6rem",
          backdropFilter: "blur(10px)"
        }}>
          {memories.length === 0 ? (
            <p style={{ color: colors.textSecondary, fontSize: "14px", margin: 0 }}>
              Processing your memories...
            </p>
          ) : (
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: 0.18
                  }
                }
              }}
            >
              {memories.map((mem, i) => (
              <motion.div key={i}
                variants={{
                  hidden: { opacity: 0, x: -10 },
                  show: { opacity: visible.includes(i) ? 1 : 0, x: visible.includes(i) ? 0 : -10 }
                }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                style={{
                display: "flex", alignItems: "flex-start", gap: "10px",
                marginBottom: i < memories.length - 1 ? "14px" : 0,
              }}>
                <span style={{
                  color: colors.accent, fontSize: "15px",
                  marginTop: "1px", flexShrink: 0
                }}>✓</span>
                <p style={{
                  color: "#D9D9D9", fontSize: "15px",
                  margin: 0, lineHeight: "1.6"
                }}>{mem}</p>
              </motion.div>
            ))}
            </motion.div>
          )}
          </div>

        <motion.button
          onClick={() => navigate("/ask")}
          whileHover={{
            scale: 1.01,
            borderColor: "rgba(139,175,110,0.7)",
            boxShadow: "0 0 32px rgba(139,175,110,0.17)"
          }}
          whileTap={{ scale: 0.98 }}
          style={{
            ...button,
            transition: "all 0.25s ease"
          }}
        >
          Start asking questions →
        </motion.button>
        </div>

      </div>
    </motion.div>
  )
}