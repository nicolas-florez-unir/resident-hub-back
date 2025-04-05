process.loadEnvFile('.env.testing');

module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './',
  testEnvironment: 'node',
  collectCoverageFrom: ['<rootDir>/src/**/*.(t|j)s'],
  modulePaths: ['<rootDir>'],
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coveragePathIgnorePatterns: [
    '<rootDir>/test/',
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/coverage/',
    '<rootDir>/prisma/',
    '<rootDir>/src/modules/.*.module.ts',
    '<rootDir>/src/app.module.ts',
    '<rootDir>/src/main.ts',
    '<rootDir>/src/common/env/*',
  ],
  coverageThreshold: {
    global: {
      branches: 40,
      functions: 40,
      lines: 40,
      statements: 40,
    },
  },
  moduleNameMapper: {
    '@common/(.*)': '<rootDir>/src/common/$1',
    '@auth/(.*)': '<rootDir>/src/modules/auth/$1',
    '@user/(.*)': '<rootDir>/src/modules/user/$1',
    '@condominium/(.*)': '<rootDir>/src/modules/condominium/$1',
  },
};
