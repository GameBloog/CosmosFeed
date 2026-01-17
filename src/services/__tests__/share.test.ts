import * as Sharing from "expo-sharing"
import { shareArticle } from "../share"
import { Article } from "../api"

jest.mock("expo-sharing")

describe("Share Service", () => {
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

  describe("shareArticle", () => {
    it("should share article successfully", async () => {
      ;(Sharing.isAvailableAsync as jest.Mock).mockResolvedValueOnce(true)
      ;(Sharing.shareAsync as jest.Mock).mockResolvedValueOnce(undefined)

      await shareArticle(mockArticle)

      const expectedMessage = `${mockArticle.title}\n\n${mockArticle.summary}\n\nRead more: ${mockArticle.url}`
      expect(Sharing.shareAsync).toHaveBeenCalledWith(expectedMessage)
    })

    it("should throw error when sharing is not available", async () => {
      ;(Sharing.isAvailableAsync as jest.Mock).mockResolvedValueOnce(false)

      await expect(shareArticle(mockArticle)).rejects.toThrow(
        "Failed to share article",
      )
    })

    it("should throw error when share fails", async () => {
      ;(Sharing.isAvailableAsync as jest.Mock).mockResolvedValueOnce(true)
      ;(Sharing.shareAsync as jest.Mock).mockRejectedValueOnce(
        new Error("Share error"),
      )

      await expect(shareArticle(mockArticle)).rejects.toThrow(
        "Failed to share article",
      )
    })
  })
})
