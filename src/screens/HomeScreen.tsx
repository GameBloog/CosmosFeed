import { useState, useEffect, useCallback } from "react"
import { FlatList, StyleSheet, View, ActivityIndicator } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootStackParamList } from "../../App"
import { Article, fetchArticles } from "../services/api"
import ArticleCard from "../components/ArticleCard"
import LoadingIndicator from "../components/LoadingIndicator"
import ErrorView from "../components/ErrorView"
import { theme } from "../styles/theme"

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const LIMIT = 20

  const loadArticles = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
        setOffset(0)
        setHasMore(true)
      } else {
        setLoading(true)
      }

      setError(null)
      const data = await fetchArticles(LIMIT, 0)
      setArticles(data)
      setOffset(LIMIT)
      setHasMore(data.length === LIMIT)
    } catch (err) {
      setError("Failed to load articles. Please try again.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const loadMoreArticles = async () => {
    if (loadingMore || !hasMore) return

    try {
      setLoadingMore(true)
      const data = await fetchArticles(LIMIT, offset)

      if (data.length < LIMIT) {
        setHasMore(false)
      }

      if (data.length > 0) {
        setArticles((prev) => [...prev, ...data])
        setOffset((prev) => prev + LIMIT)
      }
    } catch (err) {
      console.error("Error loading more articles:", err)
    } finally {
      setLoadingMore(false)
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

  const handleRefresh = () => {
    loadArticles(true)
  }

  const renderFooter = () => {
    if (!loadingMore) return null

    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={theme.colors.text.tertiary} />
      </View>
    )
  }

  if (loading) {
    return <LoadingIndicator />
  }

  if (error) {
    return <ErrorView message={error} onRetry={() => loadArticles()} />
  }

  useEffect(() => {
    loadArticles()
  }, [])

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
        onEndReached={loadMoreArticles}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListFooterComponent={renderFooter}
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
  footer: {
    paddingVertical: theme.spacing.lg,
    alignItems: "center",
  },
})
