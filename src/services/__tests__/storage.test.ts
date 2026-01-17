import AsyncStorage from "@react-native-async-storage/async-storage"
import {
  saveArticle,
  removeArticle,
  getSavedArticles,
  isArticleSaved,
} from "../storage"
import { Article } from "../api"

jest.mock("@react-native-async-storage/async-storage")

describe("Storage Service", () => {
  const mockArticle: Article = {
    id: 1,
    title: "Test Article",
    url: "https://test.com",
    image_url: "https://test.com/image.jpg",
    news_site: "Test Site",
    summary: "Test summary",
    published_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("saveArticle", () => {
    it("should save article successfully", async () => {
      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null)
      ;(AsyncStorage.setItem as jest.Mock).mockResolvedValueOnce(undefined)

      await saveArticle(mockArticle)

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "@cosmos_feed:saved_articles",
        JSON.stringify([mockArticle]),
      )
    })

    it("should not save duplicate article", async () => {
      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify([mockArticle]),
      )

      await saveArticle(mockArticle)

      expect(AsyncStorage.setItem).not.toHaveBeenCalled()
    })

    it("should throw error when save fails", async () => {
      ;(AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(
        new Error("Storage error"),
      )
      ;(AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(
        new Error("Storage error"),
      )

      await expect(saveArticle(mockArticle)).rejects.toThrow(
        "Failed to save article",
      )
    })
  })

  describe("removeArticle", () => {
    it("should remove article successfully", async () => {
      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify([mockArticle]),
      )
      ;(AsyncStorage.setItem as jest.Mock).mockResolvedValueOnce(undefined)

      await removeArticle(1)

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "@cosmos_feed:saved_articles",
        JSON.stringify([]),
      )
    })

    it("should throw error when remove fails", async () => {
      ;(AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(
        new Error("Storage error"),
      )
      ;(AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(
        new Error("Storage error"),
      )

      await expect(removeArticle(1)).rejects.toThrow("Failed to remove article")
    })
  })

  describe("getSavedArticles", () => {
    it("should return saved articles", async () => {
      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify([mockArticle]),
      )

      const result = await getSavedArticles()

      expect(result).toEqual([mockArticle])
    })

    it("should return empty array when no articles saved", async () => {
      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null)

      const result = await getSavedArticles()

      expect(result).toEqual([])
    })

    it("should return empty array on error", async () => {
      ;(AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(
        new Error("Storage error"),
      )

      const result = await getSavedArticles()

      expect(result).toEqual([])
    })
  })

  describe("isArticleSaved", () => {
    it("should return true if article is saved", async () => {
      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify([mockArticle]),
      )

      const result = await isArticleSaved(1)

      expect(result).toBe(true)
    })

    it("should return false if article is not saved", async () => {
      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify([mockArticle]),
      )

      const result = await isArticleSaved(2)

      expect(result).toBe(false)
    })

    it("should return false on error", async () => {
      ;(AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(
        new Error("Storage error"),
      )

      const result = await isArticleSaved(1)

      expect(result).toBe(false)
    })
  })
})
