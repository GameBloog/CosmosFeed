import { renderHook, waitFor, act } from "@testing-library/react-native"
import { Alert, Linking } from "react-native"
import { useDetailsViewModel } from "../useDetailsViewModel"
import * as storage from "../../../services/storage"
import * as share from "../../../services/share"

jest.mock("react-native", () => ({
  Alert: {
    alert: jest.fn(),
  },
  Linking: {
    openURL: jest.fn(() => Promise.resolve(true)),
    canOpenURL: jest.fn(() => Promise.resolve(true)),
  },
}))

jest.mock("../../../services/storage")
jest.mock("../../../services/share")

const mockAlert = jest.spyOn(Alert, "alert")

describe("useDetailsViewModel", () => {
  const mockParams = {
    id: 1,
    title: "Test Article",
    summary: "Test summary",
    imageUrl: "https://test.com/image.jpg",
    url: "https://test.com/article",
    publishedAt: "2024-01-01T00:00:00Z",
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
    const { result } = renderHook(() => useDetailsViewModel(mockParams))

    await waitFor(() => {
      expect(result.current.isSaved).toBe(false)
    })
  })

  it("should initialize with isSaved as true when article is saved", async () => {
    ;(storage.isArticleSaved as jest.Mock).mockResolvedValue(true)

    const { result } = renderHook(() => useDetailsViewModel(mockParams))

    await waitFor(() => {
      expect(result.current.isSaved).toBe(true)
    })
  })

  it("should save article when handleSave is called", async () => {
    const { result } = renderHook(() => useDetailsViewModel(mockParams))

    await waitFor(() => {
      expect(result.current.isSaved).toBe(false)
    })

    await act(async () => {
      await result.current.handleSave()
    })

    await waitFor(() => {
      expect(storage.saveArticle).toHaveBeenCalled()
      expect(mockAlert).toHaveBeenCalledWith(
        "Success",
        "Article saved successfully",
      )
      expect(result.current.isSaved).toBe(true)
    })
  })

  it("should remove article when handleSave is called and article is saved", async () => {
    ;(storage.isArticleSaved as jest.Mock).mockResolvedValue(true)

    const { result } = renderHook(() => useDetailsViewModel(mockParams))

    await waitFor(() => {
      expect(result.current.isSaved).toBe(true)
    })

    await act(async () => {
      await result.current.handleSave()
    })

    await waitFor(() => {
      expect(storage.removeArticle).toHaveBeenCalledWith(mockParams.id)
      expect(mockAlert).toHaveBeenCalledWith(
        "Success",
        "Article removed from saved",
      )
      expect(result.current.isSaved).toBe(false)
    })
  })

  it("should handle save error", async () => {
    ;(storage.saveArticle as jest.Mock).mockRejectedValue(
      new Error("Save failed"),
    )

    const { result } = renderHook(() => useDetailsViewModel(mockParams))

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
    const { result } = renderHook(() => useDetailsViewModel(mockParams))

    await act(async () => {
      await result.current.handleShare()
    })

    await waitFor(() => {
      expect(share.shareArticle).toHaveBeenCalled()
    })
  })

  it("should handle share error", async () => {
    ;(share.shareArticle as jest.Mock).mockRejectedValue(
      new Error("Share failed"),
    )

    const { result } = renderHook(() => useDetailsViewModel(mockParams))

    await act(async () => {
      await result.current.handleShare()
    })

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith("Error", "Failed to share article")
    })
  })

  it("should open URL when handleReadMore is called", () => {
    const spy = jest.spyOn(Linking, "openURL")

    const { result } = renderHook(() => useDetailsViewModel(mockParams))

    act(() => {
      result.current.handleReadMore()
    })

    expect(spy).toHaveBeenCalledWith(mockParams.url)
  })

  it("should format date correctly", () => {
    const { result } = renderHook(() => useDetailsViewModel(mockParams))

    const formattedDate = result.current.formatDate("2024-01-15T00:00:00Z")

    expect(formattedDate).toBe("January 15, 2024")
  })

  it("should create article from params correctly", async () => {
    const { result } = renderHook(() => useDetailsViewModel(mockParams))

    await act(async () => {
      await result.current.handleShare()
    })

    await waitFor(() => {
      expect(share.shareArticle).toHaveBeenCalledWith(
        expect.objectContaining({
          id: mockParams.id,
          title: mockParams.title,
          summary: mockParams.summary,
          image_url: mockParams.imageUrl,
          url: mockParams.url,
          published_at: mockParams.publishedAt,
        }),
      )
    })
  })
})
