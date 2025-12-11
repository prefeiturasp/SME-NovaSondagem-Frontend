import '@testing-library/jest-dom';

Object.defineProperty(globalThis, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock import.meta.env para testes com Vite
interface GlobalWithImport {
  import: {
    meta: {
      env: Record<string, string>;
    };
  };
}

(globalThis as unknown as GlobalWithImport).import = {
  meta: {
    env: {
      VITE_NOVA_SONDAGEM_API: 'http://localhost:3000'
    }
  }
};
