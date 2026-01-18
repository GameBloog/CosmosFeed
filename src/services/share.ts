import { Share, Platform } from "react-native"
import { Article } from "./api"

export const shareArticle = async (article: Article): Promise<void> => {
  try {
    const message = `${article.title}\n\n${article.summary}\n\nRead more: ${article.url}`

    const result = await Share.share(
      {
        message: Platform.OS === "ios" ? message : message,
        url: Platform.OS === "ios" ? article.url : undefined,
        title: article.title,
      },
      {
        subject: article.title,
        dialogTitle: `Share ${article.title}`,
      },
    )

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        console.log("Shared with activity type:", result.activityType)
      } else {
        console.log("Shared successfully")
      }
    } else if (result.action === Share.dismissedAction) {
      console.log("Share dismissed")
    }
  } catch (error) {
    console.error("Error sharing article:", error)
    throw new Error("Failed to share article")
  }
}
