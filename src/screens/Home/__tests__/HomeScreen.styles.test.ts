import { styles } from "../HomeScreen.styles"

describe("HomeScreen.styles", () => {
  it("should have all required styles", () => {
    expect(styles.container).toBeDefined()
    expect(styles.listContent).toBeDefined()
    expect(styles.footer).toBeDefined()
  })
})
