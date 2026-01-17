import axios from "axios"

const API_BASE_URL = "https://api.spaceflightnewsapi.net/v4"

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

export const fetchArticles = async (limit: number = 20): Promise<Article[]> => {
  try {
    const response = await axios.get<ApiResponse>(`${API_BASE_URL}/articles/`, {
      params: { limit },
    })

    return response.data.results
  } catch (error) {
    throw new Error("Failed to fetch articles")
  }
}
