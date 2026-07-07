import { useState } from "react"
import { colors, logo } from "../styles"

const SUGGESTED = [
  "What projects am I currently working on?",
  "Who are my important customers?",
  "Summarise my business.",
  "What should I follow up on?"
]

export default function Ask() {
  const [question, setQuestion] = useState("")
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [inputFocused, setInputFocused] = useState(false)
  const [pulse, setPulse] = useState(null)
  const [pulseLoading, setPulseLoading] = useState(false)
  const [showPulse, setShowPulse] = useState(false)
  const [showWhatsApp, setShowWhatsApp] = useState(false)
  const [waText, setWaText] = useState("")
  const [waLoading, setWaLoading] = useState(false)

  const business_id = localStorage.getItem("business_id")
  const business_name = localStorage.getItem("business_name")

  const isQuestion = (text) => {
    const t = text.trim().toLowerCase()

    const statementStarters = [
      "client meeting", "we agreed", "i think it's best", "fyi", "heads up",
      "note that", "remember that", "i am to see", "i have a meeting",
      "i have 7", "i ihave"
    ]

    const isLongStatement = t.length > 60 && statementStarters.some(s => t.startsWith(s))

    if (isLongStatement) return false

    return true
  }

  const ask = async (q) => {
    const query = q || question
    if (!query.trim()) return

    setMessages(prev => [...prev, { role: "user", text: query }])
    setQuestion("")
    setLoading(true)

    try {
      if (!isQuestion(query)) {
        await fetch("https://biasharabrain.up.railway.app/memory/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            business_id,
            content: query,
            input_type: "text"
          })
        })
        setMessages(prev => [...prev, {
          role: "agent",
          text: "✓ Got it. I've saved that to your business memory."
        }])
      } else {
        const res = await fetch("https://biasharabrain.up.railway.app/memory/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ business_id, question: query })
        })
        const data = await res.json()
        setMessages(prev => [...prev, { role: "agent", text: data.answer }])
      }
    } catch {
      setMessages(prev => [...prev, {
        role: "agent",
        text: "Something went wrong. Please try again."
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setMessages(prev => [...prev, { role: "user", text: `📎 ${file.name}` }])
    setUploading(true)

    const formData = new FormData()
    formData.append("business_id", business_id)
    formData.append("file", file)

    try {
      await fetch("https://biasharabrain.up.railway.app/memory/upload", {
        method: "POST",
        body: formData
      })
      setMessages(prev => [...prev, {
        role: "agent",
        text: "✓ Got it. I've saved that to your business memory."
      }])
    } catch {
      setMessages(prev => [...prev, {
        role: "agent",
        text: "Upload failed. Please try again."
      }])
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const fetchPulse = async () => {
    setPulseLoading(true)
    setShowPulse(true)
    try {
      const res = await fetch(`https://biasharabrain.up.railway.app/memory/${business_id}/pulse`)
      const data = await res.json()
      setPulse(data.pulse)
    } catch {
      setPulse("Couldn't generate your business pulse right now. Please try again.")
    } finally {
      setPulseLoading(false)
    }
  }

  const submitWhatsApp = async () => {
    if (!waText.trim()) return
    setWaLoading(true)
    try {
      await fetch("https://biasharabrain.up.railway.app/memory/whatsapp-forward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business_id, conversation: waText })
      })
      setMessages(prev => [...prev, {
        role: "user",
        text: "📱 Forwarded a WhatsApp conversation"
      }, {
        role: "agent",
        text: "✓ Got it. I've read through that conversation and saved what matters to your business memory."
      }])
      setWaText("")
      setShowWhatsApp(false)
    } catch {
      setMessages(prev => [...prev, {
        role: "agent",
        text: "Couldn't process that conversation. Please try again."
      }])
    } finally {
      setWaLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: colors.bg,
      display: "flex",
      flexDirection: "column",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .msg { animation: slideUp 0.3s ease forwards; }
        .suggest-btn:hover { border-color: ${colors.borderGreen} !important; color: ${colors.accent} !important; }
        .send-btn:hover { background: #222 !important; }
        .send-btn:active { transform: scale(0.95); }
        .upload-btn:hover { border-color: ${colors.borderGreen} !important; }
        .wa-btn:hover { background: #222 !important; }
      `}</style>

      <div style={{
        padding: "1rem 1.5rem",
        borderBottom: `0.5px solid #1A1A1A`,
        display: "flex", alignItems: "center", gap: "10px",
        animation: "fadeIn 0.4s ease"
      }}>
        <div style={logo.wrapper}>
          <span style={{ fontSize: "14px" }}>🧠</span>
        </div>
        <span style={{ color: colors.textPrimary, fontSize: "14px", fontWeight: "500" }}>
          Biashara Brain
        </span>
        <span style={{ color: colors.textMuted, fontSize: "14px", margin: "0 2px" }}>—</span>
        <span style={{ color: colors.textSecondary, fontSize: "14px" }}>{business_name}</span>

        <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
          <button
            className="wa-btn"
            onClick={() => setShowWhatsApp(true)}
            style={{
              background: colors.surface,
              border: `0.5px solid ${colors.border}`,
              borderRadius: "20px", padding: "6px 12px",
              color: colors.textSecondary, fontSize: "12px",
              cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
              transition: "background 0.2s"
            }}
          >
            📱 Forward
          </button>
          <button
            onClick={fetchPulse}
            style={{
              background: colors.surface,
              border: `0.5px solid ${colors.borderGreen}`,
              borderRadius: "20px", padding: "6px 12px",
              color: colors.accent, fontSize: "12px",
              cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
              transition: "background 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#222"}
            onMouseLeave={e => e.currentTarget.style.background = colors.surface}
          >
            ⚡ Pulse
          </button>
        </div>
      </div>

      {showWhatsApp && (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.7)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "1.5rem", zIndex: 50,
          animation: "fadeIn 0.2s ease"
        }}>
          <div style={{
            background: "#0D0D0D",
            border: `0.5px solid ${colors.border}`,
            borderRadius: "12px",
            padding: "1.5rem",
            width: "100%", maxWidth: "440px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem" }}>
              <span style={{ fontSize: "18px" }}>📱</span>
              <p style={{ color: colors.textPrimary, fontSize: "15px", fontWeight: "500", margin: 0 }}>
                Forward a WhatsApp conversation
              </p>
            </div>
            <p style={{ color: colors.textSecondary, fontSize: "13px", margin: "0 0 1rem", lineHeight: "1.6" }}>
              Paste a conversation with a customer or supplier. I'll read it and remember what matters — no manual typing needed.
            </p>
            <textarea
              value={waText}
              onChange={e => setWaText(e.target.value)}
              placeholder={`Customer: Hi, is the order ready?\nMe: Yes, ready for pickup tomorrow\nCustomer: Great, I'll send the balance of 2000 then`}
              rows={6}
              style={{
                width: "100%", background: colors.surface,
                border: `0.5px solid ${colors.border}`, borderRadius: "8px",
                padding: "12px", color: colors.textPrimary, fontSize: "13px",
                outline: "none", resize: "none", lineHeight: "1.6",
                boxSizing: "border-box", marginBottom: "1rem",
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
              }}
            />
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => { setShowWhatsApp(false); setWaText("") }}
                style={{
                  flex: 1, background: "transparent",
                  border: `0.5px solid ${colors.border}`,
                  borderRadius: "8px", padding: "10px",
                  color: colors.textSecondary, fontSize: "13px",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <button
                onClick={submitWhatsApp}
                disabled={waLoading}
                style={{
                  flex: 1, background: colors.surface,
                  border: `0.5px solid ${colors.borderGreen}`,
                  borderRadius: "8px", padding: "10px",
                  color: colors.accent, fontSize: "13px",
                  fontWeight: "500", cursor: "pointer",
                  opacity: waLoading ? 0.7 : 1
                }}
              >
                {waLoading ? "Reading..." : "Remember this"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showPulse && (
        <div style={{
          margin: "1rem 1.5rem 0",
          background: colors.surface2,
          border: `0.5px solid ${colors.borderGreen}`,
          borderRadius: "8px",
          padding: "1.25rem",
          animation: "fadeIn 0.4s ease",
          position: "relative"
        }}>
          <button
            onClick={() => setShowPulse(false)}
            style={{
              position: "absolute", top: "10px", right: "12px",
              background: "none", border: "none",
              color: colors.textMuted, fontSize: "14px",
              cursor: "pointer"
            }}
          >
            ✕
          </button>
          <p style={{
            color: colors.accent, fontSize: "12px",
            fontWeight: "500", margin: "0 0 10px",
            letterSpacing: "0.02em", textTransform: "uppercase"
          }}>
            🧠 Business Pulse
          </p>
          {pulseLoading ? (
            <p style={{ color: colors.textSecondary, fontSize: "14px", margin: 0 }}>
              Analyzing your business...
            </p>
          ) : (
            <p style={{
              color: "#CCCCCC", fontSize: "14px",
              margin: 0, lineHeight: "1.7",
              whiteSpace: "pre-line"
            }}>
              {pulse}
            </p>
          )}
        </div>
      )}

      <div style={{
        flex: 1, overflowY: "auto", padding: "1.5rem",
        display: "flex", flexDirection: "column", gap: "12px"
      }}>

        {messages.length === 0 && (
          <div style={{
            margin: "auto", textAlign: "center",
            maxWidth: "380px", padding: "1rem",
            animation: "fadeIn 0.5s ease"
          }}>
            <div style={{
              width: "48px", height: "48px", borderRadius: "50%",
              background: colors.surface,
              border: `0.5px solid ${colors.borderGreen}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 1rem"
            }}>
              <span style={{ fontSize: "22px" }}>🧠</span>
            </div>
            <p style={{
              color: colors.textPrimary,
              fontSize: "clamp(16px, 4vw, 18px)",
              fontWeight: "500", margin: "0 0 8px", letterSpacing: "-0.02em"
            }}>
              What would you like to know?
            </p>
            <p style={{
              color: colors.textSecondary, fontSize: "13px",
              margin: "0 0 2rem", lineHeight: "1.6"
            }}>
              Ask anything about your business — or type, upload, or forward a chat to remember it.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {SUGGESTED.map((s, i) => (
                <button
                  key={i}
                  className="suggest-btn"
                  onClick={() => ask(s)}
                  style={{
                    background: colors.surface,
                    border: `0.5px solid ${colors.border}`,
                    borderRadius: "8px", padding: "10px 14px",
                    color: colors.textSecondary, fontSize: "13px",
                    cursor: "pointer", textAlign: "left",
                    transition: "border-color 0.2s, color 0.2s"
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className="msg" style={{
            display: "flex", flexDirection: "column",
            alignItems: msg.role === "user" ? "flex-end" : "flex-start"
          }}>
            <p style={{
              fontSize: "11px", color: colors.textMuted,
              margin: "0 0 4px",
              paddingLeft: msg.role === "agent" ? "4px" : 0,
              paddingRight: msg.role === "user" ? "4px" : 0
            }}>
              {msg.role === "user" ? "You" : "Biashara Brain"}
            </p>
            <div style={{
              maxWidth: "75%",
              background: msg.role === "user" ? colors.surface : colors.surface2,
              border: msg.role === "user"
                ? `0.5px solid ${colors.border}`
                : `0.5px solid #1E2A18`,
              borderRadius: "8px", padding: "10px 14px"
            }}>
              <p style={{
                color: msg.role === "user" ? "#CCCCCC" : "#BBBBBB",
                fontSize: "14px", margin: 0, lineHeight: "1.7"
              }}>
                {msg.text}
              </p>
            </div>
          </div>
        ))}

        {(loading || uploading) && (
          <div className="msg" style={{ display: "flex", alignItems: "flex-start" }}>
            <div style={{
              background: colors.surface2,
              border: `0.5px solid #1E2A18`,
              borderRadius: "8px", padding: "10px 14px"
            }}>
              <p style={{ color: colors.accentDim, fontSize: "14px", margin: 0 }}>
                {uploading ? "Uploading..." : "Thinking..."}
              </p>
            </div>
          </div>
        )}
      </div>

      <div style={{
        padding: "1rem 1.5rem",
        borderTop: `0.5px solid #1A1A1A`,
        display: "flex", flexDirection: "column", gap: "8px"
      }}>
        <div style={{ display: "flex", gap: "8px" }}>
          <label className="upload-btn" style={{
            background: colors.surface,
            border: `0.5px solid ${colors.border}`,
            borderRadius: "8px", padding: "11px 14px",
            cursor: "pointer", display: "flex", alignItems: "center",
            transition: "border-color 0.2s"
          }}>
            <span style={{ fontSize: "16px" }}>📎</span>
            <input
              type="file"
              accept="image/*,audio/*,video/*"
              onChange={handleFileUpload}
              style={{ display: "none" }}
              disabled={uploading}
            />
          </label>

          <input
            type="text"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => e.key === "Enter" && ask()}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            placeholder={uploading ? "Uploading..." : "Ask anything or type something to remember..."}
            disabled={uploading}
            style={{
              flex: 1, background: colors.surface,
              border: inputFocused
                ? `0.5px solid ${colors.borderGreen}`
                : `0.5px solid ${colors.border}`,
              borderRadius: "8px", padding: "11px 14px",
              color: colors.textPrimary, fontSize: "14px",
              outline: "none", transition: "border-color 0.2s",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
            }}
          />
          <button
            className="send-btn"
            onClick={() => ask()}
            disabled={uploading}
            style={{
              background: colors.surface,
              border: `0.5px solid ${colors.borderGreen}`,
              borderRadius: "8px", padding: "11px 18px",
              color: colors.accent, fontSize: "16px",
              cursor: "pointer", transition: "background 0.2s, transform 0.1s"
            }}
          >
            →
          </button>
        </div>
        <p style={{
          color: colors.textMuted, fontSize: "11px",
          textAlign: "center", margin: 0
        }}>
          Ask, type to remember, attach a file 📎, or forward a chat 📱
        </p>
      </div>
    </div>
  )
}