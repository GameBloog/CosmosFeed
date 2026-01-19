import { Article } from "../../services/api"

export interface FavoritesScreenState {
  savedArticles: Article[]
  refreshing: boolean
}
