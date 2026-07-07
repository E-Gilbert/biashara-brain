import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { colors, button, input, logo, card } from "../styles"

export default function FirstDump() {
  const navigate = useNavigate()
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [focused, setFocused] = useState(false)

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError("Tell me something about your business first.")
      return
    }
    setLoading(true)
    setError("")
    const business_id = localStorage.getItem("business_id")
    try {
      await fetch("https://biasharabrain.up.railway.app/memory/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business_id, content, input_type: "text" })
      })
      navigate("/processing", { state: { content } })
    } catch (err) {
      setError("Something went wrong. Is the backend running?")
    } finally {
      setLoading(false)
    }
  }

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
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.08, duration: 0.5 }}
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(60% 45% at 15% 10%, rgba(139,175,110,0.14) 0%, rgba(8,8,8,0) 100%)"
        }}
      />

      <div style={{ width: "100%", maxWidth: "900px", zIndex: 1 }}>

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

        <div style={{ ...card, padding: "2rem" }}>
          <h1 style={{
            color: colors.textPrimary,
            fontSize: "clamp(30px, 6vw, 44px)",
            fontWeight: "700", margin: "0 0 10px",
            letterSpacing: "-0.035em", lineHeight: "1.1"
          }}>
            Tell me about your business.
          </h1>
          <p style={{
            color: colors.textSecondary, fontSize: "16px",
            margin: "0 0 2rem", lineHeight: "1.6"
          }}>
            Customers, suppliers, projects, debts, goals — anything. I'll organise it and remember it for you.
          </p>

          <textarea
            className="textarea-field"
            value={content}
            onChange={e => setContent(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={`My biggest customer is Sori Town Market. We are installing internet infrastructure there. The project budget is KSh 250,000. We source networking equipment from Nairobi. We are also testing Starlink before expanding...`}
            rows={8}
            style={{
              ...input,
              resize: "none",
              lineHeight: "1.8",
              border: focused
                ? `1px solid ${colors.borderGreen}`
                : `1px solid ${colors.border}`,
              boxShadow: focused ? "0 0 32px rgba(139,175,110,0.14)" : "none",
              minHeight: "300px",
              transition: "all 0.2s ease",
              marginBottom: "12px"
            }}
          />

          <div style={{
            background: colors.surface2,
            border: `1px solid ${colors.border}`,
            borderRadius: "14px",
            padding: "10px 14px",
            marginBottom: "24px",
            transition: "border-color 0.2s"
          }}>
            <p style={{
              color: colors.accentDim, fontSize: "12px",
              margin: 0, lineHeight: "1.6"
            }}>
              💡 The more you share, the smarter I get. Don't hold back.
            </p>
          </div>

          {error && (
            <p style={{
              color: "#B97878", fontSize: "14px",
              marginBottom: "16px",
              animation: "shake 0.4s ease"
            }}>
              {error}
            </p>
          )}

          <motion.button
            onClick={handleSubmit}
            disabled={loading}
            whileHover={{
              scale: 1.01,
              borderColor: "rgba(139,175,110,0.7)",
              boxShadow: "0 0 32px rgba(139,175,110,0.17)"
            }}
            whileTap={{ scale: 0.98 }}
            style={{
              ...button,
              transition: "all 0.25s ease",
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "Remembering..." : "Remember this →"}
          </motion.button>
        </div>

      </div>
    </motion.div>
  )
}