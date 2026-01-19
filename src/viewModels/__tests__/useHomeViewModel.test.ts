import { renderHook, waitFor, act } from "@testing-library/react-native"
import { useHomeViewModel } from "../../screens/Home/useHomeViewModel"
import * as api from "../../services/api"
import { Article } from "../../services/api"

jest.mock("../../../services/api")

describe("useHomeViewModel", () => {
  const mockArticles: Article[] = [
    {
      id: 1,
      title: "Article 1",
      url: "https://test.com/1",
      image_url: "https://test.com/image1.jpg",
      news_site: "Site 1",
      summary: "Summary 1",
      published_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
    {
      id: 2,
      title: "Article 2",
      url: "https://test.com/2",
      image_url: "https://test.com/image2.jpg",
      news_site: "Site 2",
      summary: "Summary 2",
      published_at: "2024-01-02T00:00:00Z",
      updated_at: "2024-01-02T00:00:00Z",
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    ;(api.fetchArticles as jest.Mock).mockResolvedValue(mockArticles)
  })

  it("should load articles on mount", async () => {
    const { result } = renderHook(() => useHomeViewModel())

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.articles).toEqual(mockArticles)
      expect(result.current.error).toBeNull()
    })
  })

  it("should set error when fetch fails", async () => {
    ;(api.fetchArticles as jest.Mock).mockRejectedValue(
      new Error("Network error"),
    )

    const { result } = renderHook(() => useHomeViewModel())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(
        "Failed to load articles. Please try again.",
      )
      expect(result.current.articles).toEqual([])
    })
  })

  it("should refresh articles", async () => {
    const { result } = renderHook(() => useHomeViewModel())

    await waitFor(() => {
      expect(result.current.articles).toEqual(mockArticles)
    })

    const newArticles = [
      ...mockArticles,
      {
        id: 3,
        title: "Article 3",
        url: "https://test.com/3",
        image_url: "https://test.com/image3.jpg",
        news_site: "Site 3",
        summary: "Summary 3",
        published_at: "2024-01-03T00:00:00Z",
        updated_at: "2024-01-03T00:00:00Z",
      },
    ]

    ;(api.fetchArticles as jest.Mock).mockResolvedValue(newArticles)

    await act(async () => {
      result.current.handleRefresh()
    })

    await waitFor(() => {
      expect(result.current.refreshing).toBe(false)
      expect(result.current.articles).toEqual(newArticles)
    })
  })

  it("should load more articles", async () => {
    const { result } = renderHook(() => useHomeViewModel())

    await waitFor(() => {
      expect(result.current.articles).toHaveLength(2)
    })

    const moreArticles = [
      {
        id: 3,
        title: "Article 3",
        url: "https://test.com/3",
        image_url: "https://test.com/image3.jpg",
        news_site: "Site 3",
        summary: "Summary 3",
        published_at: "2024-01-03T00:00:00Z",
        updated_at: "2024-01-03T00:00:00Z",
      },
    ]

    ;(api.fetchArticles as jest.Mock).mockResolvedValue(moreArticles)

    await act(async () => {
      await result.current.loadMoreArticles()
    })

    await waitFor(() => {
      expect(result.current.articles).toHaveLength(3)
      expect(result.current.loadingMore).toBe(false)
    })
  })

  it("should retry loading articles", async () => {
    ;(api.fetchArticles as jest.Mock).mockRejectedValueOnce(
      new Error("Network error"),
    )

    const { result } = renderHook(() => useHomeViewModel())

    await waitFor(() => {
      expect(result.current.error).toBeTruthy()
    })
    ;(api.fetchArticles as jest.Mock).mockResolvedValue(mockArticles)

    await act(async () => {
      result.current.handleRetry()
    })

    await waitFor(() => {
      expect(result.current.error).toBeNull()
      expect(result.current.articles).toEqual(mockArticles)
    })
  })

  it("should not load more when already loading", async () => {
    const { result } = renderHook(() => useHomeViewModel())

    await waitFor(() => {
      expect(result.current.articles).toHaveLength(2)
    })

    act(() => {
      result.current.loadMoreArticles()
      result.current.loadMoreArticles()
    })

    await waitFor(() => {
      expect(api.fetchArticles).toHaveBeenCalledTimes(2) // initial + one loadMore
    })
  })

  it("should set hasMore to false when less articles are returned", async () => {
    ;(api.fetchArticles as jest.Mock).mockResolvedValue([mockArticles[0]])

    const { result } = renderHook(() => useHomeViewModel())

    await waitFor(() => {
      expect(result.current.hasMore).toBe(false)
    })
  })
})
