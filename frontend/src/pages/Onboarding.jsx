import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { colors, button, input, logo, card } from "../styles"

function Field({ label, placeholder, value, onChange, focused, onFocus, onBlur }) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <label style={{
        display: "block",
        color: focused ? colors.accent : colors.textSecondary,
        fontSize: "13px", marginBottom: "8px", letterSpacing: "0.01em",
        transition: "color 0.2s"
      }}>
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        style={{
          ...input,
          border: focused
            ? `1px solid ${colors.borderGreen}`
            : `1px solid ${colors.border}`,
          boxShadow: focused ? "0 0 24px rgba(139,175,110,0.12)" : "none",
          transition: "border-color 0.2s, box-shadow 0.2s"
        }}
      />
    </div>
  )
}

export default function Onboarding() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: "", type: "", owner_name: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [focused, setFocused] = useState("")

  useEffect(() => {
    const existing = localStorage.getItem("business_id")
    if (existing) navigate("/ask")
  }, [])

  const handleSubmit = async () => {
    if (!form.name || !form.type || !form.owner_name) {
      setError("Please fill in all fields.")
      return
    }
    setLoading(true)
    setError("")
    try {
      const res = await fetch("https://biasharabrain.up.railway.app/business/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      localStorage.setItem("business_id", data.id)
      localStorage.setItem("business_name", data.name)
      navigate("/dump")
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
          background: "radial-gradient(60% 45% at 70% 0%, rgba(139,175,110,0.12) 0%, rgba(8,8,8,0) 100%)"
        }}
      />

      <div style={{ width: "100%", maxWidth: "520px", zIndex: 1 }}>

        <div
          onClick={() => navigate("/")}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === "Enter" && navigate("/")}
          style={{
          display: "flex", alignItems: "center", gap: "10px",
          marginBottom: "2.4rem",
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
            Your business memory<br />starts here.
          </h1>
          <p style={{
            color: colors.textSecondary, fontSize: "16px",
            margin: "0 0 2rem", lineHeight: "1.6"
          }}>
            Tell us about your business to get started.
          </p>

          <Field
            label="Business name"
            placeholder="e.g. MEA Tech"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            focused={focused === "name"}
            onFocus={() => setFocused("name")}
            onBlur={() => setFocused("")}
          />
          <Field
            label="Business type"
            placeholder="e.g. Hardware Store, Salon, ISP"
            value={form.type}
            onChange={e => setForm({ ...form, type: e.target.value })}
            focused={focused === "type"}
            onFocus={() => setFocused("type")}
            onBlur={() => setFocused("")}
          />
          <Field
            label="Your name"
            placeholder="e.g. E. Gilbert"
            value={form.owner_name}
            onChange={e => setForm({ ...form, owner_name: e.target.value })}
            focused={focused === "owner_name"}
            onFocus={() => setFocused("owner_name")}
            onBlur={() => setFocused("")}
          />

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
            {loading ? "Setting up..." : "Continue →"}
          </motion.button>

          <p style={{
            color: colors.textSecondary, fontSize: "13px",
            textAlign: "center", marginTop: "1.2rem"
          }}>
            Your data stays private. Always.
          </p>
        </div>
      </div>
    </motion.div>
  )
}