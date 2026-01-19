import { renderHook, waitFor, act } from "@testing-library/react-native"
import { useFavoritesViewModel } from "../useFavoritesViewModel"
import * as storage from "../../../services/storage"
import { Article } from "../../../services/api"

jest.mock("@react-navigation/native", () => ({
  useFocusEffect: jest.fn((callback) => callback()),
}))

jest.mock("../../../services/storage")

describe("useFavoritesViewModel", () => {
  const mockArticles: Article[] = [
    {
      id: 1,
      title: "Saved Article 1",
      url: "https://test.com/1",
      image_url: "https://test.com/image1.jpg",
      news_site: "Site 1",
      summary: "Summary 1",
      published_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    ;(storage.getSavedArticles as jest.Mock).mockResolvedValue(mockArticles)
  })

  it("should load saved articles on mount", async () => {
    const { result } = renderHook(() => useFavoritesViewModel())

    await waitFor(() => {
      expect(result.current.savedArticles).toEqual(mockArticles)
    })
  })

  it("should load empty array when no saved articles", async () => {
    ;(storage.getSavedArticles as jest.Mock).mockResolvedValue([])

    const { result } = renderHook(() => useFavoritesViewModel())

    await waitFor(() => {
      expect(result.current.savedArticles).toEqual([])
    })
  })

  it("should refresh saved articles", async () => {
    const { result } = renderHook(() => useFavoritesViewModel())

    await waitFor(() => {
      expect(result.current.savedArticles).toEqual(mockArticles)
    })

    const newArticles = [
      ...mockArticles,
      {
        id: 2,
        title: "Saved Article 2",
        url: "https://test.com/2",
        image_url: "https://test.com/image2.jpg",
        news_site: "Site 2",
        summary: "Summary 2",
        published_at: "2024-01-02T00:00:00Z",
        updated_at: "2024-01-02T00:00:00Z",
      },
    ]

    ;(storage.getSavedArticles as jest.Mock).mockResolvedValue(newArticles)

    await act(async () => {
      await result.current.handleRefresh()
    })

    await waitFor(() => {
      expect(result.current.refreshing).toBe(false)
      expect(result.current.savedArticles).toEqual(newArticles)
    })
  })

  it("should set refreshing state correctly", async () => {
    const { result } = renderHook(() => useFavoritesViewModel())

    act(() => {
      result.current.handleRefresh()
    })

    expect(result.current.refreshing).toBe(true)

    await waitFor(() => {
      expect(result.current.refreshing).toBe(false)
    })
  })

  it("should reload articles when loadSavedArticles is called", async () => {
    const { result } = renderHook(() => useFavoritesViewModel())

    await waitFor(() => {
      expect(result.current.savedArticles).toEqual(mockArticles)
    })
    ;(storage.getSavedArticles as jest.Mock).mockResolvedValue([])

    await act(async () => {
      await result.current.loadSavedArticles()
    })

    await waitFor(() => {
      expect(result.current.savedArticles).toEqual([])
    })
  })
})
