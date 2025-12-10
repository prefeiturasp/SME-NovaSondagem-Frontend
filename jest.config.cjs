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
        tsconfig: './tsconfig.test.json',
      },
    ],
  },

  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },

  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],

  // ✔ Cobertura ajustada corretamente
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',          // ignora types
    '!src/main.tsx',           // ignora entrada da aplicação
    '!src/App.tsx',            // ignora arquivo estrutural
    '!src/vite-env.d.ts',      // ignora env types
    '!__mocks__/**/*',         // ignora mocks
  ],

  // ✔ Alternativa adicional: ignora por padrão
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
