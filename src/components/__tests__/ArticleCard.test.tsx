import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react-native"
import { Alert } from "react-native"
import ArticleCard from "../ArticleCard"
import * as storage from "../../services/storage"
import * as share from "../../services/share"
import { Article } from "../../services/api"

jest.mock("../../services/storage")
jest.mock("../../services/share")
jest.spyOn(Alert, "alert")

describe("ArticleCard", () => {
  const mockArticle: Article = {
    id: 1,
    title: "Test Article Title",
    url: "https://test.com",
    image_url: "https://test.com/image.jpg",
    news_site: "Test Site",
    summary: "This is a test article summary",
    published_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  }

  const mockOnPress = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(storage.isArticleSaved as jest.Mock).mockResolvedValue(false)
  })

  it("should render article information", async () => {
    render(<ArticleCard article={mockArticle} onPress={mockOnPress} />)

    expect(screen.getByText("Test Article Title")).toBeTruthy()
    expect(screen.getByText("This is a test article summary")).toBeTruthy()
    expect(screen.getByText("Test Site")).toBeTruthy()
  })

  it("should call onPress when card is pressed", async () => {
    const { getByText } = render(
      <ArticleCard article={mockArticle} onPress={mockOnPress} />,
    )

    const title = getByText("Test Article Title")
    const card = title.parent?.parent

    if (card) {
      fireEvent.press(card)
      expect(mockOnPress).toHaveBeenCalledTimes(1)
    }
  })

  it("should save article when save button is pressed", async () => {
    ;(storage.saveArticle as jest.Mock).mockResolvedValue(undefined)

    const { getByText } = render(
      <ArticleCard article={mockArticle} onPress={mockOnPress} />,
    )

    const saveButton = getByText("☆")
    fireEvent.press(saveButton)

    await waitFor(() => {
      expect(storage.saveArticle).toHaveBeenCalledWith(mockArticle)
      expect(Alert.alert).toHaveBeenCalledWith(
        "Success",
        "Article saved successfully",
      )
    })
  })

  it("should remove article when already saved", async () => {
    ;(storage.isArticleSaved as jest.Mock).mockResolvedValue(true)
    ;(storage.removeArticle as jest.Mock).mockResolvedValue(undefined)

    const { getByText } = render(
      <ArticleCard article={mockArticle} onPress={mockOnPress} />,
    )

    await waitFor(() => {
      const saveButton = getByText("★")
      fireEvent.press(saveButton)
    })

    await waitFor(() => {
      expect(storage.removeArticle).toHaveBeenCalledWith(mockArticle.id)
      expect(Alert.alert).toHaveBeenCalledWith(
        "Success",
        "Article removed from saved",
      )
    })
  })

  it("should share article when share button is pressed", async () => {
    ;(share.shareArticle as jest.Mock).mockResolvedValue(undefined)

    const { getByText } = render(
      <ArticleCard article={mockArticle} onPress={mockOnPress} />,
    )

    const shareButton = getByText("↗")
    fireEvent.press(shareButton)

    await waitFor(() => {
      expect(share.shareArticle).toHaveBeenCalledWith(mockArticle)
    })
  })

  it("should show error alert when save fails", async () => {
    ;(storage.saveArticle as jest.Mock).mockRejectedValue(
      new Error("Save failed"),
    )

    const { getByText } = render(
      <ArticleCard article={mockArticle} onPress={mockOnPress} />,
    )

    const saveButton = getByText("☆")
    fireEvent.press(saveButton)

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "Failed to save article",
      )
    })
  })

  it("should show error alert when share fails", async () => {
    ;(share.shareArticle as jest.Mock).mockRejectedValue(
      new Error("Share failed"),
    )

    const { getByText } = render(
      <ArticleCard article={mockArticle} onPress={mockOnPress} />,
    )

    const shareButton = getByText("↗")
    fireEvent.press(shareButton)

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "Failed to share article",
      )
    })
  })
})
