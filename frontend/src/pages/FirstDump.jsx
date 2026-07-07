import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { colors, button, input, logo } from "../styles"

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
        .textarea-field:focus { border-color: ${colors.borderGreen} !important; }
      `}</style>

      <div style={{ width: "100%", maxWidth: "520px" }}>

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
            Tell me about your business.
          </h1>
          <p style={{
            color: colors.textSecondary, fontSize: "14px",
            margin: "0 0 2rem", lineHeight: "1.6"
          }}>
            Customers, suppliers, projects, debts, goals — anything. I'll organise it and remember it for you.
          </p>
        </div>

        <div style={{ animation: "fadeIn 0.5s ease 0.3s both" }}>
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
              lineHeight: "1.7",
              border: focused
                ? `0.5px solid ${colors.borderGreen}`
                : `0.5px solid ${colors.border}`,
              transition: "border-color 0.2s",
              marginBottom: "12px"
            }}
          />

          <div style={{
            background: colors.surface2,
            border: `0.5px solid ${colors.border}`,
            borderRadius: "8px",
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
            {loading ? "Remembering..." : "Remember this →"}
          </button>
        </div>

      </div>
    </div>
  )
}