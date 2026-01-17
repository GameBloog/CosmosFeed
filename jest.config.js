module.exports = {
  preset: "jest-expo",
  setupFiles: [],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transformIgnorePatterns: [
    "node_modules/(?!(?:.pnpm/)?(" +
      "(jest-)?react-native" +
      "|@react-native(-community)?" +
      "|@react-native/js-polyfills" +
      "|expo(nent)?" +
      "|@expo(nent)?" +
      "|@expo-google-fonts" +
      "|react-navigation" +
      "|@react-navigation" +
      "|@unimodules" +
      "|unimodules" +
      "|sentry-expo" +
      "|native-base" +
      "|react-native-svg" +
      "))",
  ],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/__tests__/**",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  testMatch: [
    "**/__tests__/**/*.test.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)",
  ],
  testEnvironment: "jsdom",
}
