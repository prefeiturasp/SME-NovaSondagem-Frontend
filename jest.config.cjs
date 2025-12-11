module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',

  roots: ['<rootDir>/src'],

  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],

  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
          esModuleInterop: true,
          verbatimModuleSyntax: false,
          allowImportingTsExtensions: false,
          moduleResolution: 'node',
          module: 'esnext',
          target: 'ES2022',
          types: ['jest', '@testing-library/jest-dom', 'node', 'vite/client']
        },
      },
    ],
    '^.+\\.(js|jsx)$': [
      'ts-jest',
      {
        tsconfig: {
          allowJs: true,
          esModuleInterop: true,
        },
      },
    ],
  },

  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },

  transformIgnorePatterns: [
    'node_modules/(?!(antd|@ant-design|@rc-component|rc-.*|@babel)/)',
  ],

  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],

  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',          // ignora types
    '!src/main.tsx',           // ignora entrada da aplicação
    '!src/App.tsx',            // ignora arquivo estrutural
    '!src/AppRoutes.tsx',      // ignora roteamento
    '!src/vite-env.d.ts',      // ignora env types
    '!__mocks__/**/*',         // ignora mocks
  ],

  coveragePathIgnorePatterns: [
    '<rootDir>/__mocks__/',
    '<rootDir>/src/main.tsx',
    '<rootDir>/src/App.tsx',
    '<rootDir>/jest.config.cjs',
  ],

  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
};
