import { styles } from "../ArticleCard.styles"

describe("ArticleCard.styles", () => {
  it("should have all required styles", () => {
    expect(styles.container).toBeDefined()
    expect(styles.image).toBeDefined()
    expect(styles.content).toBeDefined()
    expect(styles.title).toBeDefined()
    expect(styles.summary).toBeDefined()
    expect(styles.footer).toBeDefined()
    expect(styles.site).toBeDefined()
    expect(styles.actions).toBeDefined()
    expect(styles.actionButton).toBeDefined()
    expect(styles.actionText).toBeDefined()
  })
})
