import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app wrapper', () => {
  render(<App />);
  const appElement = document.querySelector('.app-wrapper');
  expect(appElement).toBeInTheDocument();
});
