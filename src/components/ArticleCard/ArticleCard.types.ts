import { Article } from "../../services/api"

export interface ArticleCardProps {
  article: Article
  onPress: () => void
  onSaveToggle?: () => void
}
