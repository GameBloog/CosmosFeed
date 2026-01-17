export const theme = {
  colors: {
    background: {
      primary: "#0a0e27",
      secondary: "#1a1f3a",
      tertiary: "#2a3154",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b8c1ec",
      tertiary: "#6b7db8",
    },
    accent: {
      primary: "#4a5d9e",
      secondary: "#5a6dae",
    },
    error: "#ff6b6b",
    success: "#51cf66",
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    round: 999,
  },

  typography: {
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 24,
      xxl: 32,
    },
    weights: {
      regular: "400" as const,
      medium: "500" as const,
      semibold: "600" as const,
      bold: "700" as const,
    },
  },

  shadows: {
    card: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
  },
}
