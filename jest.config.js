/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['vue', 'ts', 'js', 'jsx', 'tsx'],
  transformIgnorePatterns: ['/node_modules/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.vue$': 'vue3-jest'
  },
  collectCoverage: true,
  coverageReporters: ['html', 'json'],
  collectCoverageOnlyFrom: { 'src/**/*.{js,ts,vue}': true }
}
