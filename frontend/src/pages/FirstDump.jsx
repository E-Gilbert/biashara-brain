import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function FirstDump() {
  const navigate = useNavigate()
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError("Tell me something about your business first.")
      return
    }
    setLoading(true)
    setError("")
    const business_id = localStorage.getItem("business_id")
    try {
      await fetch("http://127.0.0.1:8000/memory/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_id,
          content,
          input_type: "text"
        })
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
      background: "#0D0D0D",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      <div style={{ width: "100%", maxWidth: "520px" }}>

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
          Tell me about your business.
        </h1>
        <p style={{ color: "#6B6B6B", fontSize: "14px", margin: "0 0 2rem", lineHeight: "1.6" }}>
          Customers, suppliers, projects, debts, goals — anything. I'll organise it and remember it for you.
        </p>

        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder={`My biggest customer is Sori Town Market. We are installing internet infrastructure there. The project budget is KSh 250,000. We source networking equipment from Nairobi. We are also testing Starlink before expanding...`}
          rows={8}
          style={{
            width: "100%", background: "#1A1A1A",
            border: "0.5px solid #2A2A2A", borderRadius: "8px",
            padding: "14px", color: "#FFFFFF", fontSize: "14px",
            outline: "none", boxSizing: "border-box",
            resize: "none", lineHeight: "1.7",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          }}
        />

        <div style={{
          background: "#111",
          border: "0.5px solid #2A2A2A",
          borderRadius: "8px",
          padding: "10px 14px",
          marginTop: "12px",
          marginBottom: "24px"
        }}>
          <p style={{ color: "#4A5C3A", fontSize: "12px", margin: 0, lineHeight: "1.6" }}>
            💡 The more you share, the smarter I get. Don't hold back.
          </p>
        </div>

        {error && (
          <p style={{ color: "#7A4A4A", fontSize: "13px", marginBottom: "16px" }}>{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%", background: "#1A1A1A",
            border: "0.5px solid #3A4A2A", borderRadius: "8px",
            padding: "12px", color: "#A8C080", fontSize: "14px",
            fontWeight: "500", cursor: "pointer", letterSpacing: "-0.01em"
          }}
          onMouseEnter={e => e.target.style.background = "#222"}
          onMouseLeave={e => e.target.style.background = "#1A1A1A"}
        >
          {loading ? "Remembering..." : "Remember this →"}
        </button>

      </div>
    </div>
  )
}