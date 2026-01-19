import { StyleSheet } from "react-native"
import { theme } from "../../styles/theme"

export const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.sm,
    overflow: "hidden",
    ...theme.shadows.card,
  },
  image: {
    width: "100%",
    height: 200,
    backgroundColor: theme.colors.background.primary,
  },
  content: {
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  summary: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  site: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.tertiary,
    fontWeight: theme.typography.weights.medium,
  },
  actions: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.background.tertiary,
    justifyContent: "center",
    alignItems: "center",
  },
  actionText: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.primary,
  },
})
