import { render, screen } from '@testing-library/react';
import App from './App';

test('renders router navigation buttons', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: 'Home' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Contact' })).toBeInTheDocument();
});
