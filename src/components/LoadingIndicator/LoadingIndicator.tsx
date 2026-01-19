import { View, ActivityIndicator, Text } from "react-native"
import { theme } from "../../styles/theme"
import { styles } from "./LoadingIndicator.styles"

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
