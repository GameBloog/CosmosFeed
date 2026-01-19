import { styles } from "../DetailsScreen.styles"

describe("DetailsScreen.styles", () => {
  it("should have all required styles", () => {
    expect(styles.container).toBeDefined()
    expect(styles.image).toBeDefined()
    expect(styles.content).toBeDefined()
    expect(styles.date).toBeDefined()
    expect(styles.title).toBeDefined()
    expect(styles.summary).toBeDefined()
    expect(styles.actions).toBeDefined()
    expect(styles.actionButton).toBeDefined()
    expect(styles.saveButton).toBeDefined()
    expect(styles.shareButton).toBeDefined()
    expect(styles.actionButtonText).toBeDefined()
    expect(styles.readMoreButton).toBeDefined()
    expect(styles.readMoreText).toBeDefined()
  })
})
