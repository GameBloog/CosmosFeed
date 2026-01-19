import { useState, useCallback } from "react"
import { useFocusEffect } from "@react-navigation/native"
import { Article } from "../../services/api"
import { getSavedArticles } from "../../services/storage"
import { FavoritesScreenState } from "./FavoritesScreen.types"

export const useFavoritesViewModel = () => {
  const [state, setState] = useState<FavoritesScreenState>({
    savedArticles: [],
    refreshing: false,
  })

  const loadSavedArticles = useCallback(async () => {
    const articles = await getSavedArticles()
    setState((prev) => ({ ...prev, savedArticles: articles }))
  }, [])

  const handleRefresh = useCallback(async () => {
    setState((prev) => ({ ...prev, refreshing: true }))
    await loadSavedArticles()
    setState((prev) => ({ ...prev, refreshing: false }))
  }, [loadSavedArticles])

  useFocusEffect(
    useCallback(() => {
      loadSavedArticles()
    }, [loadSavedArticles]),
  )

  return {
    ...state,
    loadSavedArticles,
    handleRefresh,
  }
}
