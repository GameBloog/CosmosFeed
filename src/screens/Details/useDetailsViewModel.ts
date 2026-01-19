import { useState, useEffect, useCallback } from "react"
import { Alert, Linking } from "react-native"
import {
  saveArticle,
  removeArticle,
  isArticleSaved,
} from "../../services/storage"
import { shareArticle } from "../../services/share"
import { Article } from "../../services/api"

interface UseDetailsViewModelParams {
  id: number
  title: string
  summary: string
  imageUrl: string
  url: string
  publishedAt: string
}

export const useDetailsViewModel = (params: UseDetailsViewModelParams) => {
  const [isSaved, setIsSaved] = useState(false)

  const createArticleFromParams = useCallback(
    (): Article => ({
      id: params.id,
      title: params.title,
      summary: params.summary,
      image_url: params.imageUrl,
      url: params.url,
      published_at: params.publishedAt,
      news_site: "",
      updated_at: "",
    }),
    [params],
  )

  const checkIfSaved = useCallback(async () => {
    const saved = await isArticleSaved(params.id)
    setIsSaved(saved)
  }, [params.id])

  const handleSave = async () => {
    try {
      const article = createArticleFromParams()

      if (isSaved) {
        await removeArticle(params.id)
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
      const article = createArticleFromParams()
      await shareArticle(article)
    } catch (error) {
      Alert.alert("Error", "Failed to share article")
    }
  }

  const handleReadMore = () => {
    Linking.openURL(params.url)
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
  }, [checkIfSaved])

  return {
    isSaved,
    handleSave,
    handleShare,
    handleReadMore,
    formatDate,
  }
}
