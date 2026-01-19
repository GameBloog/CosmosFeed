import { Article } from "../../services/api"

export interface HomeScreenState {
  articles: Article[]
  loading: boolean
  loadingMore: boolean
  refreshing: boolean
  error: string | null
  offset: number
  hasMore: boolean
}
