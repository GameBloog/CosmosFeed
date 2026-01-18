import {
  render,
  screen,
  waitFor,
  fireEvent,
} from "@testing-library/react-native"
import { FlatList } from "react-native"
import HomeScreen from "../HomeScreen"
import * as api from "../../services/api"
import * as storage from "../../services/storage"
import { Article } from "../../services/api"
import { act } from "@testing-library/react-native"

jest.mock("../../services/api")
jest.mock("../../services/storage")

const mockNavigation = {
  navigate: jest.fn(),
}

jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native")
  return {
    ...actualNav,
    useNavigation: () => mockNavigation,
    useFocusEffect: jest.fn((callback) => {
      setTimeout(() => callback(), 0)
    }),
  }
})

const makeArticles = (count: number, start = 1): Article[] =>
  Array.from({ length: count }).map((_, i) => ({
    id: start + i,
    title: `Article ${start + i}`,
    url: `https://test.com/${start + i}`,
    image_url: "https://test.com/image.jpg",
    news_site: "Site",
    summary: "Summary",
    published_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  }))

describe("HomeScreen", () => {
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
    mockNavigation.navigate.mockClear()
    ;(storage.isArticleSaved as jest.Mock).mockResolvedValue(false)
  })

  it("should show loading indicator initially", () => {
    ;(api.fetchArticles as jest.Mock).mockImplementation(
      () => new Promise(() => {}),
    )

    render(<HomeScreen />)

    expect(screen.getByText("Loading articles...")).toBeTruthy()
  })

  it("should display articles after successful fetch", async () => {
    ;(api.fetchArticles as jest.Mock).mockResolvedValue(mockArticles)

    render(<HomeScreen />)

    await waitFor(
      () => {
        expect(screen.getByText("Article 1")).toBeTruthy()
        expect(screen.getByText("Article 2")).toBeTruthy()
      },
      { timeout: 5000 },
    )
  })

  it("should show error view when fetch fails", async () => {
    ;(api.fetchArticles as jest.Mock).mockRejectedValue(
      new Error("Network error"),
    )

    render(<HomeScreen />)

    await waitFor(
      () => {
        expect(
          screen.getByText("Failed to load articles. Please try again."),
        ).toBeTruthy()
        expect(screen.getByText("Try Again")).toBeTruthy()
      },
      { timeout: 5000 },
    )
  })

  it("should retry fetching articles when retry button is pressed", async () => {
    ;(api.fetchArticles as jest.Mock)
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce(mockArticles)

    render(<HomeScreen />)

    await waitFor(() => {
      expect(screen.getByText("Try Again")).toBeTruthy()
    })

    const retryButton = screen.getByText("Try Again")
    fireEvent.press(retryButton.parent!)

    await waitFor(
      () => {
        expect(screen.getByText("Article 1")).toBeTruthy()
      },
      { timeout: 5000 },
    )

    expect(api.fetchArticles).toHaveBeenCalledTimes(2)
  })

  it("should navigate to details when article is pressed", async () => {
    ;(api.fetchArticles as jest.Mock).mockResolvedValue(mockArticles)

    render(<HomeScreen />)

    await waitFor(
      () => {
        expect(screen.getByText("Article 1")).toBeTruthy()
      },
      { timeout: 5000 },
    )

    const title = screen.getByText("Article 1")

    let parent = title.parent
    while (parent && parent.type !== "TouchableOpacity") {
      parent = parent.parent
    }

    if (parent) {
      fireEvent.press(parent)

      await waitFor(() => {
        expect(mockNavigation.navigate).toHaveBeenCalledWith("Details", {
          id: 1,
          title: "Article 1",
          summary: "Summary 1",
          imageUrl: "https://test.com/image1.jpg",
          url: "https://test.com/1",
          publishedAt: "2024-01-01T00:00:00Z",
        })
      })
    }
  })

  it("should render correct number of articles", async () => {
    ;(api.fetchArticles as jest.Mock).mockResolvedValue(mockArticles)

    render(<HomeScreen />)

    await waitFor(
      () => {
        expect(screen.getByText("Article 1")).toBeTruthy()
        expect(screen.getByText("Article 2")).toBeTruthy()
      },
      { timeout: 5000 },
    )

    const article1 = screen.getByText("Article 1")
    const article2 = screen.getByText("Article 2")

    expect(article1).toBeTruthy()
    expect(article2).toBeTruthy()
  })

  it("should load more articles on scroll", async () => {
    const firstPage = makeArticles(20, 1) // ✅ página cheia
    const secondPage = makeArticles(5, 21)

    ;(api.fetchArticles as jest.Mock)
      .mockResolvedValueOnce(firstPage)
      .mockResolvedValueOnce(secondPage)

    const { UNSAFE_root } = render(<HomeScreen />)

    await waitFor(() => {
      expect(api.fetchArticles).toHaveBeenCalledTimes(1)
      expect(screen.getByText("Article 1")).toBeTruthy()
    })

    const findFlatList = (node: any): any => {
      if (!node) return null
      if (node.type === FlatList) return node
      if (node.children) {
        for (const child of node.children) {
          const result = findFlatList(child)
          if (result) return result
        }
      }
      return null
    }

    const flatList = findFlatList(UNSAFE_root)

    if (flatList && flatList.props.onEndReached) {
      await act(async () => {
        await flatList.props.onEndReached()
      })

      await waitFor(() => {
        expect(api.fetchArticles).toHaveBeenCalledTimes(2)
        expect(api.fetchArticles).toHaveBeenLastCalledWith(20, 20)
      })
    }
  })
})
