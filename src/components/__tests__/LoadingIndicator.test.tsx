import { render, screen } from "@testing-library/react-native"
import React from "react"
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

  it("should render all elements correctly", () => {
    const { getByText, getByTestId } = render(<LoadingIndicator />)

    expect(getByText("Loading articles...")).toBeTruthy()
    expect(getByTestId("activity-indicator")).toBeTruthy()
  })
})
