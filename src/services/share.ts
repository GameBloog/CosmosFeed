import * as Sharing from "expo-sharing"
import { Article } from "./api"

export const shareArticle = async (article: Article): Promise<void> => {
  try {
    const isAvailable = await Sharing.isAvailableAsync()

    if (!isAvailable) {
      throw new Error("Sharing is not available on this device")
    }

    const message = `${article.title}\n\n${article.summary}\n\nRead more: ${article.url}`

    await Sharing.shareAsync(message)
  } catch (error) {
    throw new Error("Failed to share article")
  }
}
