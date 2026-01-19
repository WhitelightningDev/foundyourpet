import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app navigation', () => {
  render(<App />);
  expect(
    screen.getByRole("link", { name: /found your pet/i })
  ).toBeInTheDocument();
});
