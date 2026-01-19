import { FlatList, View, ActivityIndicator } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootStackParamList } from "../../../App"
import { Article } from "../../services/api"
import ArticleCard from "../../components/ArticleCard/ArticleCard"
import LoadingIndicator from "../../components/LoadingIndicator/LoadingIndicator"
import ErrorView from "../../components/ErrorView/ErrorView"
import { useHomeViewModel } from "./useHomeViewModel"
import { styles } from "./HomeScreen.styles"
import { theme } from "../../styles/theme"

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>()
  const {
    articles,
    loading,
    loadingMore,
    refreshing,
    error,
    loadMoreArticles,
    handleRefresh,
    handleRetry,
  } = useHomeViewModel()

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
    return <ErrorView message={error} onRetry={handleRetry} />
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
        onEndReached={loadMoreArticles}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListFooterComponent={renderFooter}
      />
    </View>
  )
}
