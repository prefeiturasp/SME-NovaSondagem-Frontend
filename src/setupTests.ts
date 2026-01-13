import "@testing-library/jest-dom";

const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === "string" &&
      (args[0].includes("Warning: An update to") ||
        args[0].includes("inside a test was not wrapped in act") ||
        args[0].includes("The above error occurred") ||
        args[0].includes("Consider adding an error boundary"))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

Object.defineProperty(globalThis, "matchMedia", {
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
      VITE_NOVA_SONDAGEM_API: "http://localhost:3000",
    },
  },
};
