import { theme } from "../theme"

describe("theme", () => {
  it("should have colors defined", () => {
    expect(theme.colors).toBeDefined()
    expect(theme.colors.background).toBeDefined()
    expect(theme.colors.text).toBeDefined()
    expect(theme.colors.accent).toBeDefined()
  })

  it("should have spacing defined", () => {
    expect(theme.spacing).toBeDefined()
    expect(theme.spacing.xs).toBe(4)
    expect(theme.spacing.sm).toBe(8)
    expect(theme.spacing.md).toBe(12)
  })

  it("should have border radius defined", () => {
    expect(theme.borderRadius).toBeDefined()
    expect(theme.borderRadius.sm).toBe(8)
    expect(theme.borderRadius.md).toBe(12)
  })

  it("should have typography defined", () => {
    expect(theme.typography).toBeDefined()
    expect(theme.typography.sizes).toBeDefined()
    expect(theme.typography.weights).toBeDefined()
  })

  it("should have shadows defined", () => {
    expect(theme.shadows).toBeDefined()
    expect(theme.shadows.card).toBeDefined()
  })
})
