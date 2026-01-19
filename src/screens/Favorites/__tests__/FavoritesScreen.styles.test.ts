import { styles } from "../FavoritesScreen.styles"

describe("FavoritesScreen.styles", () => {
  it("should have all required styles", () => {
    expect(styles.container).toBeDefined()
    expect(styles.listContent).toBeDefined()
    expect(styles.emptyList).toBeDefined()
    expect(styles.emptyContainer).toBeDefined()
    expect(styles.emptyEmoji).toBeDefined()
    expect(styles.emptyTitle).toBeDefined()
    expect(styles.emptyMessage).toBeDefined()
  })
})
