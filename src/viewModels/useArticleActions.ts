import { useState, useEffect, useCallback } from "react"
import { Alert } from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import { Article } from "../services/api"
import { isArticleSaved, removeArticle, saveArticle } from "../services/storage"
import { shareArticle } from "../services/share"

export const useArticleActions = (
  article: Article,
  onSaveToggle?: () => void,
) => {
  const [isSaved, setIsSaved] = useState(false)

  const checkIfSaved = useCallback(async () => {
    const saved = await isArticleSaved(article.id)
    setIsSaved(saved)
  }, [article.id])

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

      onSaveToggle?.()
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

  useEffect(() => {
    checkIfSaved()
  }, [checkIfSaved])

  useFocusEffect(
    useCallback(() => {
      checkIfSaved()
    }, [checkIfSaved]),
  )

  return {
    isSaved,
    handleSave,
    handleShare,
  }
}
