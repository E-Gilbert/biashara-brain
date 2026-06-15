import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"

export default function Processing() {
  const navigate = useNavigate()
  const location = useLocation()
  const content = location.state?.content || ""

  useEffect(() => {
    const extractMemories = async () => {
      const business_id = localStorage.getItem("business_id")
      try {
        const res = await fetch("http://127.0.0.1:8000/memory/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            business_id,
            question: `Extract the key facts from this business description as a JSON array of short strings. Each string should be one clear fact. Return only a JSON array, nothing else. Description: ${content}`
          })
        })
        const data = await res.json()
        localStorage.setItem("extracted_memories", data.answer)
      } catch (err) {
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
      background: "#0D0D0D",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      <div style={{ textAlign: "center" }}>

        <div style={{
          width: "64px", height: "64px", borderRadius: "50%",
          background: "#1A1A1A", border: "0.5px solid #3A4A2A",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 1.5rem"
        }}>
          <span style={{ fontSize: "28px" }}>🧠</span>
        </div>

        <h1 style={{
          color: "#FFFFFF", fontSize: "22px", fontWeight: "500",
          margin: "0 0 8px", letterSpacing: "-0.02em"
        }}>
          Building your business memory...
        </h1>
        <p style={{ color: "#6B6B6B", fontSize: "14px", margin: "0 0 2rem" }}>
          Reading, structuring, remembering.
        </p>

        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: i === 0 ? "#A8C080" : "#2A2A2A",
              animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`
            }} />
          ))}
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.3; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1); }
          }
        `}</style>

      </div>
    </div>
  )
}