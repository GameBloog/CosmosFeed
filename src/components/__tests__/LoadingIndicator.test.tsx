import { render, screen } from "@testing-library/react-native"
import LoadingIndicator from "../LoadingIndicator"

describe("LoadingIndicator", () => {
  it("should render loading indicator", () => {
    render(<LoadingIndicator />)

    expect(screen.getByText("Loading articles...")).toBeTruthy()
  })

  it("should display activity indicator", () => {
    const { getByTestId } = render(<LoadingIndicator />)

    const activityIndicator = getByTestId("activity-indicator")
    expect(activityIndicator).toBeTruthy()
  })
})
