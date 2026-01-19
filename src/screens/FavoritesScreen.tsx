import { useState, useCallback } from "react"
import { FlatList, StyleSheet, View, Text } from "react-native"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootStackParamList } from "../../App"
import { Article } from "../services/api"
import { getSavedArticles } from "../services/storage"
import ArticleCard from "../components/ArticleCard"
import { theme } from "../styles/theme"

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

export default function FavoritesScreen() {
  const navigation = useNavigation<NavigationProp>()
  const [savedArticles, setSavedArticles] = useState<Article[]>([])
  const [refreshing, setRefreshing] = useState(false)

  const loadSavedArticles = async () => {
    const articles = await getSavedArticles()
    setSavedArticles(articles)
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadSavedArticles()
    setRefreshing(false)
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

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>⭐</Text>
      <Text style={styles.emptyTitle}>No Saved Articles</Text>
      <Text style={styles.emptyMessage}>
        Save articles from the feed to read them later
      </Text>
    </View>
  )
  
  useFocusEffect(
    useCallback(() => {
      loadSavedArticles()
    }, []),
  )

  return (
    <View style={styles.container}>
      <FlatList
        data={savedArticles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ArticleCard
            article={item}
            onPress={() => handleArticlePress(item)}
            onSaveToggle={loadSavedArticles}
          />
        )}
        contentContainerStyle={
          savedArticles.length === 0 ? styles.emptyList : styles.listContent
        }
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={renderEmptyState}
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
  emptyList: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xxxl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: theme.spacing.lg,
  },
  emptyTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  emptyMessage: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    textAlign: "center",
    lineHeight: 22,
  },
})
