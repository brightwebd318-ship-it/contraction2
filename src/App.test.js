import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Lumina brand logo', () => {
  render(<App />);
  const logoElements = screen.getAllByText(/Lumina/i);
  expect(logoElements.length).toBeGreaterThan(0);
});

