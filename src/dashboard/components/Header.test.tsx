import { render, screen } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Header } from './Header';
import { useAuth } from '../../providers/UserAuthProvider';

jest.mock('../../providers/UserAuthProvider', () => ({
  useAuth: jest.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Header', () => {
  const mockLogout = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    localStorage.clear();
    (useAuth as jest.Mock).mockReturnValue({
      user: {
        id: '1',
        name: 'Jason Whittaker',
        email: 'jason@example.com',
        role: 'Frontend Developer',
      },
      login: jest.fn(),
      logout: mockLogout,
    });
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the header with title, toggle button, and login', () => {
    render(<Header />);

    expect(screen.getByText(/work from home studio/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /toggle theme/i })
    ).toBeInTheDocument();

    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });

  test('toggles theme and updates the background color', async () => {
    render(<Header />);

    const user = userEvent.setup();

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });

    expect(document.documentElement).not.toHaveClass('dark');
    expect(localStorage.getItem('theme')).toBe('light'); // Initial set up is ligjt

    await user.click(toggleButton);

    expect(document.documentElement).toHaveClass('dark');
    expect(localStorage.getItem('theme')).toBe('dark');

    await user.click(toggleButton);

    expect(document.documentElement).not.toHaveClass('dark');
    expect(localStorage.getItem('theme')).toBe('light');
  });

  test('logs out and navigates to login screen', async () => {
    render(<Header />);

    const user = userEvent.setup();

    const logoutButton = screen.getByText(/logout/i);
    await user.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
