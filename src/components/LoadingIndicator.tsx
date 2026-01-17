import { View, ActivityIndicator, StyleSheet, Text } from "react-native"
import { theme } from "../styles/theme"

export default function LoadingIndicator() {
  return (
    <View style={styles.container}>
      <ActivityIndicator
        size="large"
        color={theme.colors.text.tertiary}
        testID="activity-indicator"
      />
      <Text style={styles.text}>Loading articles...</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background.primary,
  },
  text: {
    marginTop: theme.spacing.lg,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
  },
})
