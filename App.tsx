import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { StatusBar } from "expo-status-bar"
import HomeScreen from "./src/screens/HomeScreen"
import DetailsScreen from "./src/screens/DetailsScreen"
import { theme } from "./src/styles/theme"

export type RootStackParamList = {
  Home: undefined
  Details: {
    id: number
    title: string
    summary: string
    imageUrl: string
    url: string
    publishedAt: string
  }
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.background.primary,
          },
          headerTintColor: theme.colors.text.primary,
          headerTitleStyle: {
            fontWeight: theme.typography.weights.semibold,
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Cosmos Feed" }}
        />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={{ title: "Article Details" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
