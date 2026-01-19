import axios from "axios"
import { EXPO_PUBLIC_API_BASE_URL } from "../env"

if (!EXPO_PUBLIC_API_BASE_URL) {
  throw new Error("Missing EXPO_PUBLIC_API_BASE_URL")
}

const API_BASE_URL = EXPO_PUBLIC_API_BASE_URL

export interface Article {
  id: number
  title: string
  url: string
  image_url: string
  news_site: string
  summary: string
  published_at: string
  updated_at: string
}

interface ApiResponse {
  count: number
  next: string | null
  previous: string | null
  results: Article[]
}

export const fetchArticles = async (
  limit: number = 20,
  offset: number = 0,
): Promise<Article[]> => {
  try {
    const response = await axios.get<ApiResponse>(`${API_BASE_URL}/articles/`, {
      params: {
        limit,
        offset,
      },
    })

    return response.data.results
  } catch (error) {
    throw new Error("Failed to fetch articles")
  }
}
