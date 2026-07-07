export const colors = {
  bg: "#080808",
  surface: "rgba(255,255,255,0.04)",
  surface2: "rgba(255,255,255,0.02)",
  border: "rgba(255,255,255,0.08)",
  borderGreen: "#8BAF6E",
  textPrimary: "#F0F0F0",
  textSecondary: "#666666",
  textMuted: "#444444",
  accent: "#8BAF6E",
  accentDim: "rgba(139,175,110,0.7)",
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
  border: `1px solid ${colors.border}`,
  borderRadius: "18px",
  padding: "1.5rem",
  backdropFilter: "blur(18px)",
  boxShadow: "0 0 40px rgba(139,175,110,0.08)",
}

export const input = {
  width: "100%",
  background: colors.surface,
  border: `1px solid ${colors.border}`,
  borderRadius: "14px",
  padding: "14px 16px",
  color: colors.textPrimary,
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
  backdropFilter: "blur(14px)",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
}

export const button = {
  width: "100%",
  background: "rgba(139,175,110,0.12)",
  border: `1px solid rgba(139,175,110,0.4)`,
  borderRadius: "14px",
  padding: "13px 16px",
  color: colors.accent,
  fontSize: "15px",
  fontWeight: "600",
  cursor: "pointer",
  letterSpacing: "-0.01em",
  boxShadow: "0 0 24px rgba(139,175,110,0.1)",
}

export const logo = {
  wrapper: {
    width: "38px", height: "38px", borderRadius: "12px",
    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
    display: "flex", alignItems: "center", justifyContent: "center"
  },
  text: {
    color: "#F0F0F0", fontSize: "16px",
    fontWeight: "650", letterSpacing: "-0.02em"
  }
}