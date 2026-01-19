import { useState, useEffect, useCallback } from "react"
import { fetchArticles, Article } from "../../services/api"
import { HomeScreenState } from "./HomeScreen.types"

const LIMIT = 20

export const useHomeViewModel = () => {
  const [state, setState] = useState<HomeScreenState>({
    articles: [],
    loading: true,
    loadingMore: false,
    refreshing: false,
    error: null,
    offset: 0,
    hasMore: true,
  })

  const loadArticles = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setState((prev) => ({
          ...prev,
          refreshing: true,
          offset: 0,
          hasMore: true,
        }))
      } else {
        setState((prev) => ({ ...prev, loading: true }))
      }

      const data = await fetchArticles(LIMIT, 0)
      setState((prev) => ({
        ...prev,
        articles: data,
        offset: LIMIT,
        hasMore: data.length === LIMIT,
        error: null,
        loading: false,
        refreshing: false,
      }))
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: "Failed to load articles. Please try again.",
        loading: false,
        refreshing: false,
      }))
    }
  }, [])

  const loadMoreArticles = useCallback(async () => {
    if (state.loadingMore || !state.hasMore) return

    try {
      setState((prev) => ({ ...prev, loadingMore: true }))
      const data = await fetchArticles(LIMIT, state.offset)

      setState((prev) => ({
        ...prev,
        articles: [...prev.articles, ...data],
        offset: prev.offset + LIMIT,
        hasMore: data.length === LIMIT,
        loadingMore: false,
      }))
    } catch (err) {
      console.error("Error loading more articles:", err)
      setState((prev) => ({ ...prev, loadingMore: false }))
    }
  }, [state.loadingMore, state.hasMore, state.offset])

  const handleRefresh = useCallback(() => {
    loadArticles(true)
  }, [loadArticles])

  const handleRetry = useCallback(() => {
    loadArticles()
  }, [loadArticles])

  useEffect(() => {
    loadArticles()
  }, [loadArticles])

  return {
    ...state,
    loadMoreArticles,
    handleRefresh,
    handleRetry,
  }
}
