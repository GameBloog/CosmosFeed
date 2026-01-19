import { styles } from "../LoadingIndicator.styles"

describe("LoadingIndicator.styles", () => {
  it("should have all required styles", () => {
    expect(styles.container).toBeDefined()
    expect(styles.text).toBeDefined()
  })
})
