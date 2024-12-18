import '@testing-library/jest-dom';

// Mock fetch
global.fetch = jest.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({})
  })
) as jest.Mock;

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true
});

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockImplementation(() => Promise.resolve())
  }
});

// Mock Element.scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

// Mock TextEncoder
class MockTextEncoder {
  encode(str: string): Uint8Array {
    return new Uint8Array([...str].map(char => char.charCodeAt(0)));
  }
}

global.TextEncoder = MockTextEncoder as any;