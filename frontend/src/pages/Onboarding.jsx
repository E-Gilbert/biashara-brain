import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { colors, button, input, logo } from "../styles"

function Field({ label, placeholder, value, onChange, focused, onFocus, onBlur }) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <label style={{
        display: "block",
        color: focused ? colors.accent : colors.textSecondary,
        fontSize: "12px", marginBottom: "6px", letterSpacing: "0.02em",
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
            ? `0.5px solid ${colors.borderGreen}`
            : `0.5px solid ${colors.border}`,
          transition: "border-color 0.2s"
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
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        .btn-primary:hover { background: #222222 !important; }
        .btn-primary:active { transform: scale(0.98); }
      `}</style>

      <div style={{ width: "100%", maxWidth: "400px" }}>

        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          marginBottom: "3rem",
          animation: "fadeIn 0.5s ease 0.1s both"
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
            Your business memory<br />starts here.
          </h1>
          <p style={{
            color: colors.textSecondary, fontSize: "14px",
            margin: "0 0 2.5rem", lineHeight: "1.6"
          }}>
            Tell us about your business to get started.
          </p>
        </div>

        <div style={{ animation: "fadeIn 0.5s ease 0.3s both" }}>
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
              color: "#7A4A4A", fontSize: "13px",
              marginBottom: "16px",
              animation: "shake 0.4s ease"
            }}>
              {error}
            </p>
          )}

          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={loading}
            style={{
              ...button,
              transition: "background 0.2s, transform 0.1s",
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "Setting up..." : "Continue →"}
          </button>

          <p style={{
            color: colors.textMuted, fontSize: "12px",
            textAlign: "center", marginTop: "1.5rem"
          }}>
            Your data stays private. Always.
          </p>
        </div>
      </div>
    </div>
  )
}