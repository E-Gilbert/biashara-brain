import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Onboarding() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: "", type: "", owner_name: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    if (!form.name || !form.type || !form.owner_name) {
      setError("Please fill in all fields.")
      return
    }
    setLoading(true)
    setError("")
    try {
      const res = await fetch("http://127.0.0.1:8000/business/", {
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
      background: "#0D0D0D",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>

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
          Your business memory<br />starts here.
        </h1>
        <p style={{ color: "#6B6B6B", fontSize: "14px", margin: "0 0 2.5rem", lineHeight: "1.6" }}>
          Tell us about your business to get started.
        </p>

        <div style={{ marginBottom: "14px" }}>
          <label style={{ display: "block", color: "#6B6B6B", fontSize: "12px", marginBottom: "6px", letterSpacing: "0.02em" }}>
            Business name
          </label>
          <input
            type="text"
            placeholder="e.g. MEA Tech"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            style={{
              width: "100%", background: "#1A1A1A",
              border: "0.5px solid #2A2A2A", borderRadius: "8px",
              padding: "11px 14px", color: "#FFFFFF", fontSize: "14px",
              outline: "none", boxSizing: "border-box",
              transition: "border-color 0.2s"
            }}
          />
        </div>

        <div style={{ marginBottom: "14px" }}>
          <label style={{ display: "block", color: "#6B6B6B", fontSize: "12px", marginBottom: "6px", letterSpacing: "0.02em" }}>
            Business type
          </label>
          <input
            type="text"
            placeholder="e.g. Hardware Store, Salon, ISP"
            value={form.type}
            onChange={e => setForm({ ...form, type: e.target.value })}
            style={{
              width: "100%", background: "#1A1A1A",
              border: "0.5px solid #2A2A2A", borderRadius: "8px",
              padding: "11px 14px", color: "#FFFFFF", fontSize: "14px",
              outline: "none", boxSizing: "border-box"
            }}
          />
        </div>

        <div style={{ marginBottom: "28px" }}>
          <label style={{ display: "block", color: "#6B6B6B", fontSize: "12px", marginBottom: "6px", letterSpacing: "0.02em" }}>
            Your name
          </label>
          <input
            type="text"
            placeholder="e.g. E. Gilbert"
            value={form.owner_name}
            onChange={e => setForm({ ...form, owner_name: e.target.value })}
            style={{
              width: "100%", background: "#1A1A1A",
              border: "0.5px solid #2A2A2A", borderRadius: "8px",
              padding: "11px 14px", color: "#FFFFFF", fontSize: "14px",
              outline: "none", boxSizing: "border-box"
            }}
          />
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
            fontWeight: "500", cursor: "pointer", letterSpacing: "-0.01em",
            transition: "background 0.2s"
          }}
          onMouseEnter={e => e.target.style.background = "#222"}
          onMouseLeave={e => e.target.style.background = "#1A1A1A"}
        >
          {loading ? "Setting up..." : "Continue →"}
        </button>

        <p style={{ color: "#3A3A3A", fontSize: "12px", textAlign: "center", marginTop: "2rem" }}>
          Your data stays private. Always.
        </p>

      </div>
    </div>
  )
}