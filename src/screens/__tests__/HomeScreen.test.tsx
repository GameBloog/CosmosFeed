import {
  render,
  screen,
  waitFor,
  fireEvent,
} from "@testing-library/react-native"
import HomeScreen from "../HomeScreen"
import * as api from "../../services/api"
import { Article } from "../../services/api"

jest.mock("../../services/api")
jest.mock("../../services/storage")

// Mock do React Navigation
jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: () => ({
    navigate: mockNavigation.navigate,
  }),
  useFocusEffect: jest.fn((callback) => callback()),
}))

const mockNavigation = {
  navigate: jest.fn(),
}

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

    await waitFor(() => {
      expect(screen.getByText("Article 1")).toBeTruthy()
      expect(screen.getByText("Article 2")).toBeTruthy()
    })
  })

  it("should show error view when fetch fails", async () => {
    ;(api.fetchArticles as jest.Mock).mockRejectedValue(
      new Error("Network error"),
    )

    render(<HomeScreen />)

    await waitFor(() => {
      expect(
        screen.getByText("Failed to load articles. Please try again."),
      ).toBeTruthy()
      expect(screen.getByText("Try Again")).toBeTruthy()
    })
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
    fireEvent.press(retryButton)

    await waitFor(() => {
      expect(screen.getByText("Article 1")).toBeTruthy()
      expect(api.fetchArticles).toHaveBeenCalledTimes(2)
    })
  })

  it("should navigate to details when article is pressed", async () => {
    ;(api.fetchArticles as jest.Mock).mockResolvedValue(mockArticles)

    render(<HomeScreen />)

    await waitFor(() => {
      expect(screen.getByText("Article 1")).toBeTruthy()
    })

    const article = screen.getByText("Article 1")
    fireEvent.press(article.parent!.parent!.parent!)

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
  })

  it("should render correct number of articles", async () => {
    ;(api.fetchArticles as jest.Mock).mockResolvedValue(mockArticles)

    const { getAllByText } = render(<HomeScreen />)

    await waitFor(() => {
      const articles = getAllByText(/Article/)
      expect(articles.length).toBe(2)
    })
  })

  it("should load more articles on scroll", async () => {
    const moreArticles: Article[] = [
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

    ;(api.fetchArticles as jest.Mock)
      .mockResolvedValueOnce(mockArticles)
      .mockResolvedValueOnce(moreArticles)

    const { getByTestId } = render(<HomeScreen />)

    await waitFor(() => {
      expect(screen.getByText("Article 1")).toBeTruthy()
    })

    // Simula scroll até o final
    const flatList = getByTestId ? getByTestId("article-list") : null
    if (flatList) {
      fireEvent.scroll(flatList, {
        nativeEvent: {
          contentOffset: { y: 500 },
          contentSize: { height: 1000 },
          layoutMeasurement: { height: 500 },
        },
      })
    }

    await waitFor(() => {
      expect(api.fetchArticles).toHaveBeenCalledTimes(2)
    })
  })
})
