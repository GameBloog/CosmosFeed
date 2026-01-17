import { useState, useEffect } from "react"
import { FlatList, StyleSheet, View } from "react-native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootStackParamList } from "../../App"
import { Article, fetchArticles } from "../services/api"
import ArticleCard from "../components/ArticleCard"
import LoadingIndicator from "../components/LoadingIndicator"
import ErrorView from "../components/ErrorView"
import { theme } from "../styles/theme"

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadArticles()
  }, [])

  const loadArticles = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchArticles()
      setArticles(data)
    } catch (err) {
      setError("Failed to load articles. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleArticlePress = (article: Article) => {
    navigation.navigate("Details", {
      id: article.id,
      title: article.title,
      summary: article.summary,
      imageUrl: article.image_url,
      url: article.url,
      publishedAt: article.published_at,
    })
  }

  if (loading) {
    return <LoadingIndicator />
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadArticles} />
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={articles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ArticleCard
            article={item}
            onPress={() => handleArticlePress(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  listContent: {
    paddingVertical: theme.spacing.sm,
  },
})
