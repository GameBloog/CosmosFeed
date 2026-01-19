import { styles } from "../ErrorView.styles"

describe("ErrorView.styles", () => {
  it("should have all required styles", () => {
    expect(styles.container).toBeDefined()
    expect(styles.emoji).toBeDefined()
    expect(styles.message).toBeDefined()
    expect(styles.button).toBeDefined()
    expect(styles.buttonText).toBeDefined()
  })
})
