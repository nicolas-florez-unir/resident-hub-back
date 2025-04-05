process.loadEnvFile('.env.testing');

module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './',
  testRegex: '.*\\.integration-test\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '<rootDir>/src/modules/**/infrastructure/repositories/*.(t|j)s',
  ],
  coverageDirectory: './coverage',
  modulePaths: ['<rootDir>'],
  testEnvironment: 'node',
  coveragePathIgnorePatterns: [
    '<rootDir>/test/',
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/coverage/',
    '<rootDir>/prisma/',
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  globalSetup: '<rootDir>/test/integration/global-integration.setup.ts',
  setupFilesAfterEnv: ['<rootDir>/test/integration/integration.setup.ts'],
  moduleNameMapper: {
    '@common/(.*)': '<rootDir>/src/common/$1',
    '@auth/(.*)': '<rootDir>/src/modules/auth/$1',
    '@user/(.*)': '<rootDir>/src/modules/user/$1',
    '@condominium/(.*)': '<rootDir>/src/modules/condominium/$1',
  },
};
