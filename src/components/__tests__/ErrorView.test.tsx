import { render, screen, fireEvent } from "@testing-library/react-native"
import ErrorView from "../ErrorView"

describe("ErrorView", () => {
  const mockOnRetry = jest.fn()
  const errorMessage = "Failed to load articles"

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should render error message", () => {
    render(<ErrorView message={errorMessage} onRetry={mockOnRetry} />)

    expect(screen.getByText(errorMessage)).toBeTruthy()
  })

  it("should render retry button", () => {
    render(<ErrorView message={errorMessage} onRetry={mockOnRetry} />)

    expect(screen.getByText("Try Again")).toBeTruthy()
  })

  it("should call onRetry when button is pressed", () => {
    render(<ErrorView message={errorMessage} onRetry={mockOnRetry} />)

    const retryButton = screen.getByText("Try Again")
    fireEvent.press(retryButton)

    expect(mockOnRetry).toHaveBeenCalledTimes(1)
  })

  it("should display warning emoji", () => {
    render(<ErrorView message={errorMessage} onRetry={mockOnRetry} />)

    expect(screen.getByText("⚠️")).toBeTruthy()
  })
})
