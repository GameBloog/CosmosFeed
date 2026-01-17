import AsyncStorage from "@react-native-async-storage/async-storage"
import { Article } from "./api"

const SAVED_ARTICLES_KEY = "@cosmos_feed:saved_articles"

export const saveArticle = async (article: Article): Promise<void> => {
  try {
    const savedArticles = await getSavedArticles()
    const isAlreadySaved = savedArticles.some((a) => a.id === article.id)

    if (!isAlreadySaved) {
      const updatedArticles = [...savedArticles, article]
      await AsyncStorage.setItem(
        SAVED_ARTICLES_KEY,
        JSON.stringify(updatedArticles),
      )
    }
  } catch (error) {
    throw new Error("Failed to save article")
  }
}

export const removeArticle = async (articleId: number): Promise<void> => {
  try {
    const savedArticles = await getSavedArticles()
    const updatedArticles = savedArticles.filter((a) => a.id !== articleId)
    await AsyncStorage.setItem(
      SAVED_ARTICLES_KEY,
      JSON.stringify(updatedArticles),
    )
  } catch (error) {
    throw new Error("Failed to remove article")
  }
}

export const getSavedArticles = async (): Promise<Article[]> => {
  try {
    const data = await AsyncStorage.getItem(SAVED_ARTICLES_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    return []
  }
}

export const isArticleSaved = async (articleId: number): Promise<boolean> => {
  try {
    const savedArticles = await getSavedArticles()
    return savedArticles.some((a) => a.id === articleId)
  } catch (error) {
    return false
  }
}
