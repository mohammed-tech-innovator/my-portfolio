import { render, screen } from '@testing-library/react';
import App from './App';

// Mock IntersectionObserver
beforeAll(() => {
  global.IntersectionObserver = class IntersectionObserver {
    observe() { return null; }
    unobserve() { return null; }
    disconnect() { return null; }
  };
});

// Mock LetterGlitch component to avoid WebGL errors in JSDOM
jest.mock('./components/LetterGlitch', () => {
  return function DummyLetterGlitch() {
    return <div data-testid="letter-glitch-mock" />;
  };
});

// Mock Waves component
jest.mock('./components/Waves', () => {
  return function DummyWaves() {
    return <div data-testid="waves-mock" />;
  };
});

test('renders portfolio name', () => {
  render(<App />);
  const nameElements = screen.getAllByText(/Mohammed Yousif/i);
  expect(nameElements.length).toBeGreaterThan(0);
});
