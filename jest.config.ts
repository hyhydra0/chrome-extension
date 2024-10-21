import type { JestConfigWithTsJest } from "ts-jest"

const config: JestConfigWithTsJest = {
  setupFiles: ["./__mocks__/chrome.ts"],
  testEnvironment: "jsdom",
  transform: {
    "^.+.ts$": ["ts-jest", {}],
  },
  collectCoverageFrom: ["src/**/*.ts"],
}
export default config
