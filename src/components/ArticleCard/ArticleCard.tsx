import { View, Text, Image, TouchableOpacity } from "react-native"
import { useArticleActions } from "../../viewModels/useArticleActions"
import { ArticleCardProps } from "./ArticleCard.types"
import { styles } from "./ArticleCard.styles"

export default function ArticleCard({
  article,
  onPress,
  onSaveToggle,
}: ArticleCardProps) {
  const { isSaved, handleSave, handleShare } = useArticleActions(
    article,
    onSaveToggle,
  )

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: article.image_url }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {article.title}
        </Text>
        <Text style={styles.summary} numberOfLines={3}>
          {article.summary}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.site}>{article.news_site}</Text>
          <View style={styles.actions}>
            <TouchableOpacity onPress={handleSave} style={styles.actionButton}>
              <Text style={styles.actionText}>{isSaved ? "★" : "☆"}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
              <Text style={styles.actionText}>↗</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}
