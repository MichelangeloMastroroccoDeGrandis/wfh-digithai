import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import { BroadcastChannel } from 'worker_threads';

Reflect.set(globalThis, 'BroadcastChannel', BroadcastChannel);

jest.mock('./providers/UserAuthProvider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useAuth: jest.fn(() => ({ user: null })),
}));

describe('App', () => {
  test('renders the App and shows the login screen', () => {
    render(<App />);

    expect(screen.getByText('Please Login to WFH Studio')).toBeInTheDocument();
  });
});
