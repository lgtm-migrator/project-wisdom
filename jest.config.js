const fetch = require('node-fetch')

module.exports = {
  verbose: true,
  testURL: 'http://localhost/',
  collectCoverage: true,
  testEnvironment: 'jsdom',
  globals: {
    ZAFClient: {
      init: () => {}
    },
    fetch: fetch,
    Request: fetch.Request
  },
  coveragePathIgnorePatterns: [
    '<rootDir>/spec'
  ],
  roots: ['./spec']
}
