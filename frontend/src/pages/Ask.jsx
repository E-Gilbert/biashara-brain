import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { colors, logo, input, card } from "../styles"

const SUGGESTED = [
  "What projects am I currently working on?",
  "Who are my important customers?",
  "Summarise my business.",
  "What should I follow up on?"
]

export default function Ask() {
  const navigate = useNavigate()
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
  const [isRecording, setIsRecording] = useState(false)
  const [recordingSeconds, setRecordingSeconds] = useState(0)
  const [recorderSupported, setRecorderSupported] = useState(false)
  const mediaRecorderRef = useRef(null)
  const mediaChunksRef = useRef([])
  const mediaStreamRef = useRef(null)

  const business_id = localStorage.getItem("business_id")
  const business_name = localStorage.getItem("business_name")

  useEffect(() => {
    const canRecord = typeof window !== "undefined" &&
      !!window.MediaRecorder &&
      !!navigator.mediaDevices &&
      !!navigator.mediaDevices.getUserMedia
    setRecorderSupported(canRecord)

    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop()
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

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

  const uploadMemoryFile = async (file, label) => {
    if (!file) return

    setMessages(prev => [...prev, { role: "user", text: label || `📎 ${file.name}` }])
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
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    await uploadMemoryFile(file)
    e.target.value = ""
  }

  const startRecording = async () => {
    if (!recorderSupported || isRecording || uploading) return

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaStreamRef.current = stream
      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder
      mediaChunksRef.current = []
      setRecordingSeconds(0)
      setIsRecording(true)

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          mediaChunksRef.current.push(event.data)
        }
      }

      recorder.onstop = async () => {
        const blob = new Blob(mediaChunksRef.current, { type: "audio/webm" })
        const file = new File([blob], `voice-note-${Date.now()}.webm`, { type: "audio/webm" })
        setIsRecording(false)
        setRecordingSeconds(0)
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach(track => track.stop())
          mediaStreamRef.current = null
        }
        await uploadMemoryFile(file, "🎙️ Voice note uploaded")
      }

      recorder.start()
    } catch {
      setMessages(prev => [...prev, {
        role: "agent",
        text: "Microphone access was blocked. Please allow mic access and try again."
      }])
      setIsRecording(false)
    }
  }

  const stopRecording = () => {
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === "inactive") return
    mediaRecorderRef.current.stop()
  }

  useEffect(() => {
    if (!isRecording) return
    const intervalId = setInterval(() => {
      setRecordingSeconds(prev => prev + 1)
    }, 1000)
    return () => clearInterval(intervalId)
  }, [isRecording])

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      style={{
      minHeight: "100vh",
      background: colors.bg,
      display: "flex",
      flexDirection: "column",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      <style>{`
        .glass {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(16px);
        }
      `}</style>

      <div style={{
        padding: "1rem 1.5rem 0.9rem",
        borderBottom: `1px solid ${colors.border}`,
        display: "flex", alignItems: "center", gap: "10px",
        flexWrap: "wrap",
        rowGap: "10px",
        background: "rgba(8,8,8,0.8)",
        backdropFilter: "blur(14px)"
      }}>
        <div
          onClick={() => navigate("/")}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === "Enter" && navigate("/")}
          style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
        >
          <div style={logo.wrapper}>
            <span style={{ fontSize: "14px" }}>🧠</span>
          </div>
          <span style={{ color: colors.textPrimary, fontSize: "16px", fontWeight: "650" }}>
            Biashara Brain
          </span>
        </div>
        <span style={{ color: colors.textMuted, fontSize: "14px", margin: "0 2px" }}>-</span>
        <span style={{ color: colors.textSecondary, fontSize: "15px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "200px" }}>{business_name}</span>

        <div style={{ marginLeft: "auto", display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "flex-end" }}>
          <motion.button
            onClick={() => setShowWhatsApp(true)}
            whileHover={{ scale: 1.02, borderColor: "rgba(139,175,110,0.6)" }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: "999px", padding: "8px 14px",
              color: colors.textSecondary, fontSize: "13px",
              cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
              transition: "all 0.2s ease"
            }}
          >
            📱 Forward
          </motion.button>
          <motion.button
            onClick={fetchPulse}
            whileHover={{
              scale: 1.02,
              borderColor: "rgba(139,175,110,0.7)",
              boxShadow: "0 0 24px rgba(139,175,110,0.16)"
            }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: "rgba(139,175,110,0.1)",
              border: `1px solid rgba(139,175,110,0.45)`,
              borderRadius: "999px", padding: "8px 14px",
              color: colors.accent, fontSize: "13px",
              cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
              transition: "all 0.2s ease"
            }}
          >
            ⚡ Business Pulse
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
      {showWhatsApp && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.75)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "1.5rem", zIndex: 50,
          backdropFilter: "blur(4px)"
        }}>
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{
            ...card,
            padding: "1.5rem",
            width: "100%", maxWidth: "440px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem" }}>
              <span style={{ fontSize: "18px" }}>📱</span>
              <p style={{ color: colors.textPrimary, fontSize: "18px", fontWeight: "650", margin: 0, letterSpacing: "-0.02em" }}>
                Forward a WhatsApp conversation
              </p>
            </div>
            <p style={{ color: colors.textSecondary, fontSize: "14px", margin: "0 0 1rem", lineHeight: "1.6" }}>
              Paste a conversation with a customer or supplier. I'll read it and remember what matters — no manual typing needed.
            </p>
            <textarea
              value={waText}
              onChange={e => setWaText(e.target.value)}
              placeholder={`Customer: Hi, is the order ready?\nMe: Yes, ready for pickup tomorrow\nCustomer: Great, I'll send the balance of 2000 then`}
              rows={6}
              style={{
                ...input,
                width: "100%",
                borderRadius: "14px",
                padding: "13px 14px", color: colors.textPrimary, fontSize: "14px",
                outline: "none", resize: "none", lineHeight: "1.6",
                boxSizing: "border-box", marginBottom: "1rem",
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
              }}
            />
            <div style={{ display: "flex", gap: "8px" }}>
              <motion.button
                onClick={() => { setShowWhatsApp(false); setWaText("") }}
                whileHover={{ scale: 1.01, borderColor: "rgba(139,175,110,0.5)" }}
                whileTap={{ scale: 0.98 }}
                style={{
                  flex: 1, background: "transparent",
                  border: `1px solid ${colors.border}`,
                  borderRadius: "12px", padding: "11px",
                  color: colors.textSecondary, fontSize: "14px",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={submitWhatsApp}
                disabled={waLoading}
                whileHover={{ scale: 1.01, boxShadow: "0 0 24px rgba(139,175,110,0.16)" }}
                whileTap={{ scale: 0.98 }}
                style={{
                  flex: 1, background: "rgba(139,175,110,0.1)",
                  border: `1px solid rgba(139,175,110,0.45)`,
                  borderRadius: "12px", padding: "11px",
                  color: colors.accent, fontSize: "14px",
                  fontWeight: "600", cursor: "pointer",
                  transition: "all 0.2s ease",
                  opacity: waLoading ? 0.7 : 1
                }}
              >
                {waLoading ? "Reading..." : "Remember this"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      <AnimatePresence>
      {showPulse && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          style={{
          margin: "1rem 1.5rem 0",
          background: colors.surface2,
          border: `1px solid rgba(139,175,110,0.35)`,
          borderRadius: "14px",
          padding: "1.25rem",
          backdropFilter: "blur(16px)",
          boxShadow: "0 0 30px rgba(139,175,110,0.12)",
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
            fontWeight: "650", margin: "0 0 10px",
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
        </motion.div>
      )}
      </AnimatePresence>

      <div style={{
        flex: 1, overflowY: "auto", padding: "1.2rem 1rem",
        display: "flex", flexDirection: "column", gap: "12px"
      }}>

        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
            margin: "auto", textAlign: "center",
            width: "min(96vw, 760px)", padding: "1.25rem",
            ...card
          }}>
            <div style={{
              width: "48px", height: "48px", borderRadius: "50%",
              background: colors.surface,
              border: `1px solid rgba(139,175,110,0.45)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 1rem",
              boxShadow: "0 0 24px rgba(139,175,110,0.16)"
            }}>
              <span style={{ fontSize: "22px" }}>🧠</span>
            </div>
            <p style={{
              color: colors.textPrimary,
              fontSize: "clamp(22px, 5vw, 30px)",
              fontWeight: "700", margin: "0 0 8px", letterSpacing: "-0.03em"
            }}>
              What would you like to know?
            </p>
            <p style={{
              color: colors.textSecondary, fontSize: "14px",
              margin: "0 0 2rem", lineHeight: "1.6"
            }}>
              Ask anything about your business — or type, upload, or forward a chat to remember it.
            </p>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "10px"
            }}>
              {SUGGESTED.map((s, i) => (
                <motion.button
                  key={i}
                  onClick={() => ask(s)}
                  whileHover={{
                    scale: 1.01,
                    borderColor: "rgba(139,175,110,0.6)",
                    color: colors.accent
                  }}
                  whileTap={{ scale: 0.985 }}
                  style={{
                    background: colors.surface,
                    border: `1px solid ${colors.border}`,
                    borderRadius: "12px", padding: "12px 14px",
                    color: colors.textSecondary, fontSize: "14px",
                    cursor: "pointer", textAlign: "left",
                    transition: "all 0.2s ease"
                  }}
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            style={{
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
              maxWidth: "min(88vw, 680px)",
              background: msg.role === "user" ? "rgba(139,175,110,0.08)" : colors.surface2,
              border: msg.role === "user"
                ? `1px solid rgba(139,175,110,0.35)`
                : `1px solid ${colors.border}`,
              borderRadius: "14px", padding: "12px 14px",
              backdropFilter: "blur(10px)"
            }}>
              <p style={{
                color: msg.role === "user" ? "#DFDFDF" : "#C5C5C5",
                fontSize: "15px", margin: 0, lineHeight: "1.7"
              }}>
                {msg.text}
              </p>
            </div>
          </motion.div>
        ))}

        {(loading || uploading) && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: "flex", alignItems: "flex-start" }}
          >
            <div style={{
              background: colors.surface2,
              border: `1px solid ${colors.border}`,
              borderRadius: "14px", padding: "10px 14px"
            }}>
              <p style={{ color: colors.accentDim, fontSize: "14px", margin: 0 }}>
                {uploading ? "Uploading..." : "Thinking..."}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      <div style={{
        padding: "1rem",
        borderTop: `1px solid ${colors.border}`,
        display: "flex", flexDirection: "column", gap: "8px"
      }}>
        <div style={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
          flexWrap: "wrap"
        }}>
          <motion.label
            whileHover={{ scale: 1.02, borderColor: "rgba(139,175,110,0.6)" }}
            whileTap={{ scale: 0.98 }}
            style={{
            background: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: "12px", padding: "11px 14px",
            cursor: "pointer", display: "flex", alignItems: "center",
            transition: "all 0.2s ease"
          }}>
            <span style={{ fontSize: "16px" }}>📎</span>
            <input
              type="file"
              accept="image/*,audio/*,video/*"
              onChange={handleFileUpload}
              style={{ display: "none" }}
              disabled={uploading}
            />
          </motion.label>

          <motion.button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={!recorderSupported || uploading}
            whileHover={{ scale: 1.02, borderColor: "rgba(139,175,110,0.7)" }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: isRecording ? "rgba(185,120,120,0.16)" : colors.surface,
              border: `1px solid ${isRecording ? "rgba(185,120,120,0.55)" : colors.border}`,
              borderRadius: "12px",
              padding: "11px 13px",
              cursor: recorderSupported ? "pointer" : "not-allowed",
              opacity: recorderSupported ? 1 : 0.45,
              color: isRecording ? "#DFA6A6" : colors.textSecondary,
              transition: "all 0.2s ease",
              minWidth: "54px"
            }}
            title={recorderSupported ? (isRecording ? "Stop recording" : "Record voice note") : "Voice recording not supported"}
          >
            {isRecording ? "■" : "🎙️"}
          </motion.button>

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
              ...input,
              flex: 1, background: colors.surface,
              minWidth: "220px",
              border: inputFocused
                ? `1px solid ${colors.borderGreen}`
                : `1px solid ${colors.border}`,
              borderRadius: "12px", padding: "11px 14px",
              color: colors.textPrimary, fontSize: "15px",
              outline: "none", transition: "all 0.2s ease",
              boxShadow: inputFocused ? "0 0 24px rgba(139,175,110,0.15)" : "none",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
            }}
          />
          <motion.button
            onClick={() => ask()}
            disabled={uploading}
            whileHover={{
              scale: 1.03,
              borderColor: "rgba(139,175,110,0.8)",
              boxShadow: "0 0 26px rgba(139,175,110,0.2)"
            }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: "rgba(139,175,110,0.1)",
              border: `1px solid rgba(139,175,110,0.55)`,
              borderRadius: "12px", padding: "11px 18px",
              color: colors.accent, fontSize: "16px",
              cursor: "pointer", transition: "all 0.2s ease"
            }}
          >
            →
          </motion.button>
        </div>
        {isRecording && (
          <p style={{
            color: "#DFA6A6",
            fontSize: "12px",
            textAlign: "center",
            margin: 0
          }}>
            Recording voice note... {String(Math.floor(recordingSeconds / 60)).padStart(2, "0")}:{String(recordingSeconds % 60).padStart(2, "0")}
          </p>
        )}
        <p style={{
          color: colors.textMuted, fontSize: "12px",
          textAlign: "center", margin: 0
        }}>
          Ask, type to remember, upload 📎, record 🎙️, or forward a chat 📱
        </p>
      </div>
    </motion.div>
  )
}