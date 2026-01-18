import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native"
import { useEffect, useState } from "react"
import { useFocusEffect } from "@react-navigation/native"
import { useCallback } from "react"
import { Article } from "../services/api"
import { isArticleSaved, removeArticle, saveArticle } from "../services/storage"
import { shareArticle } from "../services/share"
import { theme } from "../styles/theme"

interface ArticleCardProps {
  article: Article
  onPress: () => void
  onSaveToggle?: () => void
}

export default function ArticleCard({
  article,
  onPress,
  onSaveToggle,
}: ArticleCardProps) {
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    checkIfSaved()
  }, [])

  useFocusEffect(
    useCallback(() => {
      checkIfSaved()
    }, [article.id]),
  )

  const checkIfSaved = async () => {
    const saved = await isArticleSaved(article.id)
    setIsSaved(saved)
  }

  const handleSave = async () => {
    try {
      if (isSaved) {
        await removeArticle(article.id)
        setIsSaved(false)
        Alert.alert("Success", "Article removed from saved")
      } else {
        await saveArticle(article)
        setIsSaved(true)
        Alert.alert("Success", "Article saved successfully")
      }

      if (onSaveToggle) {
        onSaveToggle()
      }
    } catch (error) {
      Alert.alert("Error", "Failed to save article")
    }
  }

  const handleShare = async () => {
    try {
      await shareArticle(article)
    } catch (error) {
      Alert.alert("Error", "Failed to share article")
    }
  }

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

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.sm,
    overflow: "hidden",
    ...theme.shadows.card,
  },
  image: {
    width: "100%",
    height: 200,
    backgroundColor: theme.colors.background.primary,
  },
  content: {
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  summary: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  site: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.tertiary,
    fontWeight: theme.typography.weights.medium,
  },
  actions: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.background.tertiary,
    justifyContent: "center",
    alignItems: "center",
  },
  actionText: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.primary,
  },
})
