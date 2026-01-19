import { FlatList, View, Text } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootStackParamList } from "../../../App"
import { Article } from "../../services/api"
import ArticleCard from "../../components/ArticleCard/ArticleCard"
import { useFavoritesViewModel } from "./useFavoritesViewModel"
import { styles } from "./FavoritesScreen.styles"

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

export default function FavoritesScreen() {
  const navigation = useNavigation<NavigationProp>()
  const { savedArticles, refreshing, loadSavedArticles, handleRefresh } =
    useFavoritesViewModel()

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
