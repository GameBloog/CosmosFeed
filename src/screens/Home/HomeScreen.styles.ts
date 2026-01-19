import { StyleSheet } from "react-native"
import { theme } from "../../styles/theme"

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  listContent: {
    paddingVertical: theme.spacing.sm,
  },
  footer: {
    paddingVertical: theme.spacing.lg,
    alignItems: "center",
  },
})
