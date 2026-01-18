import { Share } from "react-native"
import { shareArticle } from "../share"
import { Article } from "../api"

jest.mock("react-native", () => ({
  Share: {
    share: jest.fn(),
    sharedAction: "sharedAction",
    dismissedAction: "dismissedAction",
  },
  Platform: {
    OS: "android",
    select: (obj: { [key: string]: any }) => obj.android ?? obj.ios,
  },
  Linking: {
    openURL: jest.fn(),
    canOpenURL: jest.fn().mockResolvedValue(true),
  },
}))

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
      ;(Share.share as jest.Mock).mockResolvedValueOnce({
        action: Share.sharedAction,
      })

      await shareArticle(mockArticle)

      expect(Share.share).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining(mockArticle.title),
          title: mockArticle.title,
        }),
        expect.objectContaining({
          subject: mockArticle.title,
        }),
      )
    })

    it("should include article summary in share message", async () => {
      ;(Share.share as jest.Mock).mockResolvedValueOnce({
        action: Share.sharedAction,
      })

      await shareArticle(mockArticle)

      expect(Share.share).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining(mockArticle.summary),
        }),
        expect.any(Object),
      )
    })

    it("should include article URL in share message", async () => {
      ;(Share.share as jest.Mock).mockResolvedValueOnce({
        action: Share.sharedAction,
      })

      await shareArticle(mockArticle)

      expect(Share.share).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining(mockArticle.url),
        }),
        expect.any(Object),
      )
    })

    it("should handle share dismissal", async () => {
      ;(Share.share as jest.Mock).mockResolvedValueOnce({
        action: Share.dismissedAction,
      })

      await expect(shareArticle(mockArticle)).resolves.not.toThrow()

      expect(Share.share).toHaveBeenCalled()
    })

    it("should handle share with activity type", async () => {
      ;(Share.share as jest.Mock).mockResolvedValueOnce({
        action: Share.sharedAction,
        activityType: "com.apple.UIKit.activity.Message",
      })

      await expect(shareArticle(mockArticle)).resolves.not.toThrow()

      expect(Share.share).toHaveBeenCalled()
    })

    it("should throw error when share fails", async () => {
      ;(Share.share as jest.Mock).mockRejectedValueOnce(
        new Error("Share error"),
      )

      await expect(shareArticle(mockArticle)).rejects.toThrow(
        "Failed to share article",
      )
    })

    it("should call share with correct dialog title", async () => {
      ;(Share.share as jest.Mock).mockResolvedValueOnce({
        action: Share.sharedAction,
      })

      await shareArticle(mockArticle)

      expect(Share.share).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          dialogTitle: `Share ${mockArticle.title}`,
        }),
      )
    })
  })
})
