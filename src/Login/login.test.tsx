import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginPage } from './login';
import { useAuth } from '../providers/UserAuthProvider';
import { useNavigate } from 'react-router-dom';

jest.mock('../providers/UserAuthProvider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('LoginPage', () => {
  const mockLogin = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      user: {
        id: '1',
        name: 'Jason Whittaker',
        email: 'jason@example.com',
        role: 'Frontend Developer',
      },
      login: mockLogin,
      logout: jest.fn(),
    });

    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  test('renders the login form', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
    expect(screen.getByText(/Please Login to WFH Studio/i)).toBeInTheDocument();
  });

  test('displays validation errors for invalid inputs', async () => {
    render(<LoginPage />);

    const user = userEvent.setup();

    await user.clear(screen.getByLabelText(/name/i));
    await user.type(screen.getByLabelText(/password/i), 'short1@');
    await user.clear(screen.getByLabelText(/role/i));

    const loginButton = screen.getByRole('button', { name: /login/i });

    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/no email entered/i)).toBeInTheDocument();
      expect(
        screen.getByText(/password must be at least 8 characters/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/role is required/i)).toBeInTheDocument();
    });
  });

  test('calls login function and navigates to dashboard on successful login', async () => {
    render(<LoginPage />);

    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/name/i), 'Jason Whittaker');
    await user.type(screen.getByLabelText(/email/i), 'jason@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password1!');
    await user.type(screen.getByLabelText(/role/i), 'Developer');

    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        id: '1',
        name: 'Jason Whittaker',
        email: 'jason@example.com',
        password: 'password1!',
        role: 'Developer',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
});
