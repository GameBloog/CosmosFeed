import { useState, useEffect } from "react"
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootStackParamList } from "../../App"
import { saveArticle, removeArticle, isArticleSaved } from "../services/storage"
import { shareArticle } from "../services/share"
import { theme } from "../styles/theme"

type DetailsScreenProps = NativeStackScreenProps<RootStackParamList, "Details">

export default function DetailsScreen({ route }: DetailsScreenProps) {
  const { id, title, summary, imageUrl, url, publishedAt } = route.params
  const [isSaved, setIsSaved] = useState(false)

  const checkIfSaved = async () => {
    const saved = await isArticleSaved(id)
    setIsSaved(saved)
  }

  const handleSave = async () => {
    try {
      const article = {
        id,
        title,
        summary,
        image_url: imageUrl,
        url,
        published_at: publishedAt,
        news_site: "",
        updated_at: "",
      }

      if (isSaved) {
        await removeArticle(id)
        setIsSaved(false)
        Alert.alert("Success", "Article removed from saved")
      } else {
        await saveArticle(article)
        setIsSaved(true)
        Alert.alert("Success", "Article saved successfully")
      }
    } catch (error) {
      Alert.alert("Error", "Failed to save article")
    }
  }

  const handleShare = async () => {
    try {
      const article = {
        id,
        title,
        summary,
        image_url: imageUrl,
        url,
        published_at: publishedAt,
        news_site: "",
        updated_at: "",
      }
      await shareArticle(article)
    } catch (error) {
      Alert.alert("Error", "Failed to share article")
    }
  }

  const handleReadMore = () => {
    Linking.openURL(url)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  useEffect(() => {
    checkIfSaved()
  }, [])

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Text style={styles.date}>{formatDate(publishedAt)}</Text>

        <Text style={styles.title}>{title}</Text>

        <Text style={styles.summary}>{summary}</Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.saveButton]}
            onPress={handleSave}
          >
            <Text style={styles.actionButtonText}>
              {isSaved ? "★ Saved" : "☆ Save"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.shareButton]}
            onPress={handleShare}
          >
            <Text style={styles.actionButtonText}>↗ Share</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.readMoreButton}
          onPress={handleReadMore}
        >
          <Text style={styles.readMoreText}>Read Full Article</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  image: {
    width: "100%",
    height: 300,
    backgroundColor: theme.colors.background.secondary,
  },
  content: {
    padding: theme.spacing.xl,
  },
  date: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.tertiary,
    marginBottom: theme.spacing.md,
    fontWeight: theme.typography.weights.medium,
  },
  title: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
    lineHeight: 32,
  },
  summary: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    lineHeight: 24,
    marginBottom: theme.spacing.xxl,
  },
  actions: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  actionButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.sm,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: theme.colors.background.tertiary,
  },
  shareButton: {
    backgroundColor: theme.colors.background.tertiary,
  },
  actionButtonText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold,
  },
  readMoreButton: {
    backgroundColor: theme.colors.accent.primary,
    paddingVertical: 14,
    paddingHorizontal: theme.spacing.xxl,
    borderRadius: theme.borderRadius.sm,
    alignItems: "center",
  },
  readMoreText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
  },
})
