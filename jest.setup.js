// jest.setup.js
import "@testing-library/jest-native/extend-expect"

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
}))

// Mock Share
jest.mock("react-native/Libraries/Share/Share", () => ({
  share: jest.fn(() => Promise.resolve({ action: "sharedAction" })),
  sharedAction: "sharedAction",
  dismissedAction: "dismissedAction",
}))

// Mock Linking
jest.mock("react-native/Libraries/Linking/Linking", () => ({
  openURL: jest.fn(() => Promise.resolve(true)),
  canOpenURL: jest.fn(() => Promise.resolve(true)),
}))

// Suprimir console.log e console.error durante os testes
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
}
