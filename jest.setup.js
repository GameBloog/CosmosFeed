import "@testing-library/jest-native/extend-expect"

jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
}))

jest.mock("react-native/Libraries/Share/Share", () => ({
  share: jest.fn(() => Promise.resolve({ action: "sharedAction" })),
  sharedAction: "sharedAction",
  dismissedAction: "dismissedAction",
}))
