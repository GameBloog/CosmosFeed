import axios from "axios"
import { fetchArticles } from "../api"

jest.mock("../../env", () => ({
  EXPO_PUBLIC_API_BASE_URL: "https://api.spaceflightnewsapi.net/v4",
}))

jest.mock("axios")
const mockedAxios = axios as jest.Mocked<typeof axios>

describe("API Service", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("fetchArticles", () => {
    it("should fetch articles successfully", async () => {
      const mockArticles = [
        {
          id: 1,
          title: "Test Article",
          url: "https://test.com",
          image_url: "https://test.com/image.jpg",
          news_site: "Test Site",
          summary: "Test summary",
          published_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
      ]

      mockedAxios.get.mockResolvedValueOnce({
        data: {
          count: 1,
          next: null,
          previous: null,
          results: mockArticles,
        },
      })

      const result = await fetchArticles()

      expect(result).toEqual(mockArticles)
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "https://api.spaceflightnewsapi.net/v4/articles/",
        { params: { limit: 20, offset: 0 } },
      )
    })

    it("should throw error when fetch fails", async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error("Network error"))

      await expect(fetchArticles()).rejects.toThrow("Failed to fetch articles")
    })

    it("should fetch articles with custom limit and offset", async () => {
      const mockArticles = [
        {
          id: 1,
          title: "Test Article",
          url: "https://test.com",
          image_url: "https://test.com/image.jpg",
          news_site: "Test Site",
          summary: "Test summary",
          published_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
      ]

      mockedAxios.get.mockResolvedValueOnce({
        data: {
          count: 1,
          next: null,
          previous: null,
          results: mockArticles,
        },
      })

      await fetchArticles(10, 20)

      expect(mockedAxios.get).toHaveBeenCalledWith(
        "https://api.spaceflightnewsapi.net/v4/articles/",
        { params: { limit: 10, offset: 20 } },
      )
    })

    it("should handle empty results", async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          count: 0,
          next: null,
          previous: null,
          results: [],
        },
      })

      const result = await fetchArticles()

      expect(result).toEqual([])
    })

    it("should use default parameters when not provided", async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          count: 0,
          next: null,
          previous: null,
          results: [],
        },
      })

      await fetchArticles()

      expect(mockedAxios.get).toHaveBeenCalledWith(
        "https://api.spaceflightnewsapi.net/v4/articles/",
        { params: { limit: 20, offset: 0 } },
      )
    })
  })
})
