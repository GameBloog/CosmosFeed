import { renderHook, waitFor, act } from "@testing-library/react-native"
import { Alert } from "react-native"
import { useArticleActions } from "../useArticleActions"
import * as storage from "../../services/storage"
import * as share from "../../services/share"
import { Article } from "../../services/api"

jest.mock("@react-navigation/native", () => ({
  useFocusEffect: jest.fn((callback) => callback()),
}))

jest.mock("../../services/storage")
jest.mock("../../services/share")

const mockAlert = jest.spyOn(Alert, "alert")

describe("useArticleActions", () => {
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
    mockAlert.mockClear()
    ;(storage.isArticleSaved as jest.Mock).mockResolvedValue(false)
    ;(storage.saveArticle as jest.Mock).mockResolvedValue(undefined)
    ;(storage.removeArticle as jest.Mock).mockResolvedValue(undefined)
    ;(share.shareArticle as jest.Mock).mockResolvedValue(undefined)
  })

  it("should initialize with isSaved as false", async () => {
    const { result } = renderHook(() => useArticleActions(mockArticle))

    await waitFor(() => {
      expect(result.current.isSaved).toBe(false)
    })
  })

  it("should initialize with isSaved as true when article is saved", async () => {
    ;(storage.isArticleSaved as jest.Mock).mockResolvedValue(true)

    const { result } = renderHook(() => useArticleActions(mockArticle))

    await waitFor(() => {
      expect(result.current.isSaved).toBe(true)
    })
  })

  it("should save article when handleSave is called", async () => {
    const { result } = renderHook(() => useArticleActions(mockArticle))

    await waitFor(() => {
      expect(result.current.isSaved).toBe(false)
    })

    ;(storage.isArticleSaved as jest.Mock).mockResolvedValue(true)

    await act(async () => {
      await result.current.handleSave()
    })

    await waitFor(() => {
      expect(storage.saveArticle).toHaveBeenCalledWith(mockArticle)
      expect(mockAlert).toHaveBeenCalledWith(
        "Success",
        "Article saved successfully",
      )
      expect(result.current.isSaved).toBe(true)
    })
  })

  it("should remove article when handleSave is called and article is saved", async () => {
    ;(storage.isArticleSaved as jest.Mock).mockResolvedValue(true)

    const { result } = renderHook(() => useArticleActions(mockArticle))

    await waitFor(() => {
      expect(result.current.isSaved).toBe(true)
    })

    ;(storage.isArticleSaved as jest.Mock).mockResolvedValue(false)

    await act(async () => {
      await result.current.handleSave()
    })

    await waitFor(() => {
      expect(storage.removeArticle).toHaveBeenCalledWith(mockArticle.id)
      expect(mockAlert).toHaveBeenCalledWith(
        "Success",
        "Article removed from saved",
      )
      expect(result.current.isSaved).toBe(false)
    })
  })

  it("should call onSaveToggle when provided", async () => {
    const mockOnSaveToggle = jest.fn()
    const { result } = renderHook(() =>
      useArticleActions(mockArticle, mockOnSaveToggle),
    )

    await waitFor(() => {
      expect(result.current.isSaved).toBe(false)
    })

    await act(async () => {
      await result.current.handleSave()
    })

    await waitFor(() => {
      expect(mockOnSaveToggle).toHaveBeenCalled()
    })
  })

  it("should handle save error", async () => {
    ;(storage.saveArticle as jest.Mock).mockRejectedValue(
      new Error("Save failed"),
    )

    const { result } = renderHook(() => useArticleActions(mockArticle))

    await waitFor(() => {
      expect(result.current.isSaved).toBe(false)
    })

    await act(async () => {
      await result.current.handleSave()
    })

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith("Error", "Failed to save article")
    })
  })

  it("should share article when handleShare is called", async () => {
    const { result } = renderHook(() => useArticleActions(mockArticle))

    await act(async () => {
      await result.current.handleShare()
    })

    await waitFor(() => {
      expect(share.shareArticle).toHaveBeenCalledWith(mockArticle)
    })
  })

  it("should handle share error", async () => {
    ;(share.shareArticle as jest.Mock).mockRejectedValue(
      new Error("Share failed"),
    )

    const { result } = renderHook(() => useArticleActions(mockArticle))

    await act(async () => {
      await result.current.handleShare()
    })

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith("Error", "Failed to share article")
    })
  })
})
