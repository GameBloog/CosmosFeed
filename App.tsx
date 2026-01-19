import "react-native-gesture-handler"
import { NavigationContainer, ParamListBase } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { StatusBar } from "expo-status-bar"
import { Text } from "react-native"
import HomeScreen from "./src/screens/Home/HomeScreen"
import FavoritesScreen from "./src/screens/Favorites/FavoritesScreen"
import DetailsScreen from "./src/screens/Details/DetailsScreen"
import { theme } from "./src/styles/theme"

export type RootStackParamList = {
  HomeTabs: ParamListBase
  Details: {
    id: number
    title: string
    summary: string
    imageUrl: string
    url: string
    publishedAt: string
  }
}

export type TabParamList = {
  Feed: ParamListBase
  Favorites: ParamListBase
}

const Stack = createNativeStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator<TabParamList>()

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background.primary,
        },
        headerTintColor: theme.colors.text.primary,
        headerTitleStyle: {
          fontWeight: theme.typography.weights.semibold,
        },
        tabBarStyle: {
          backgroundColor: theme.colors.background.secondary,
          borderTopColor: theme.colors.background.tertiary,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: theme.colors.accent.primary,
        tabBarInactiveTintColor: theme.colors.text.tertiary,
      }}
    >
      <Tab.Screen
        name="Feed"
        component={HomeScreen}
        options={{
          title: "Cosmos Feed",
          tabBarLabel: "Feed",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🌌</Text>,
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          title: "Saved Articles",
          tabBarLabel: "Saved",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>⭐</Text>,
        }}
      />
    </Tab.Navigator>
  )
}

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
          name="HomeTabs"
          component={HomeTabs}
          options={{ headerShown: false }}
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
