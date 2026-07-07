export const colors = {
  bg: "#0D0D0D",
  surface: "#1A1A1A",
  surface2: "#111111",
  border: "#2A2A2A",
  borderGreen: "#3A4A2A",
  textPrimary: "#FFFFFF",
  textSecondary: "#6B6B6B",
  textMuted: "#3A3A3A",
  accent: "#A8C080",
  accentDim: "#4A5C3A",
}

export const layout = {
  maxWidth: "480px",
  padding: "1rem",
  paddingLg: "1.5rem",
}

export const container = {
  minHeight: "100vh",
  background: colors.bg,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "1rem",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
}

export const card = {
  background: colors.surface,
  border: `0.5px solid ${colors.border}`,
  borderRadius: "8px",
  padding: "1.25rem",
}

export const input = {
  width: "100%",
  background: colors.surface,
  border: `0.5px solid ${colors.border}`,
  borderRadius: "8px",
  padding: "11px 14px",
  color: colors.textPrimary,
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
}

export const button = {
  width: "100%",
  background: colors.surface,
  border: `0.5px solid ${colors.borderGreen}`,
  borderRadius: "8px",
  padding: "12px",
  color: colors.accent,
  fontSize: "14px",
  fontWeight: "500",
  cursor: "pointer",
  letterSpacing: "-0.01em",
}

export const logo = {
  wrapper: {
    width: "32px", height: "32px", borderRadius: "8px",
    background: "#1C1C1C", border: "0.5px solid #2A2A2A",
    display: "flex", alignItems: "center", justifyContent: "center"
  },
  text: {
    color: "#FFFFFF", fontSize: "15px",
    fontWeight: "500", letterSpacing: "-0.01em"
  }
}