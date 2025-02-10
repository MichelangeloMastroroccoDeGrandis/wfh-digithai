import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Dashboard } from './dashboard';
import { useRequireAuth } from '../hooks/useRequestAuth';
import { useAuth } from '../providers/UserAuthProvider';
import { useWFHStore } from '../store/wfhRequestsStore';
import * as api from '../api/userdata';
import { UserRequest } from '../lib/types';

jest.mock('../api/userdata', () => ({
  useFetchCalendarData: jest.fn(),
}));

jest.mock('../hooks/useRequestAuth', () => ({
  useRequireAuth: jest.fn(),
}));

jest.mock('../providers/UserAuthProvider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../store/wfhRequestsStore', () => ({
  useWFHStore: jest.fn(),
}));

describe('Dashboard', () => {
  const addUserMock = jest.fn();

  const mockData: UserRequest[] = [
    {
      name: 'Jon Snow',
      dates: ['2024-12-23', '2024-12-25'],
      email: 'hello@hello.com',
      role: 'King of the North',
    },
    {
      name: 'Daenerys Targaryen',
      dates: ['2024-12-24', '2024-12-26'],
      email: 'a@a.com',
      role: 'King of the North',
    },
    {
      name: 'Tyrion Lannister',
      dates: ['2024-12-23', '2024-12-25', '2024-12-27'],
      email: 'b@a.com',
      role: 'King of the North',
    },
  ];

  beforeEach(() => {
    (useRequireAuth as jest.Mock).mockReturnValue({
      id: '1',
      name: 'Jason Whittaker',
      email: 'jason@example.com',
      role: 'Frontend Developer',
    });
    (useAuth as jest.Mock).mockReturnValue({
      user: {
        id: '1',
        name: 'Jason Whittaker',
        email: 'jason@example.com',
        role: 'Frontend Developer',
      },
      login: jest.fn(),
      logout: jest.fn(),
    });

    (api.useFetchCalendarData as jest.Mock).mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
    });

    (useWFHStore as unknown as jest.Mock).mockReturnValue({
      addUser: addUserMock,
      users: mockData,
      addDate: jest.fn(),
    });
  });
  test('renders the header, sidebar, profile, form and calendar inside the dashboard', () => {
    render(<Dashboard />);

    expect(screen.getByText('Work From Home Studio')).toBeInTheDocument();
    expect(screen.getByText('Menu')).toBeInTheDocument();
    expect(screen.getByText('Book Work From Home')).toBeInTheDocument();
    expect(screen.getByText('User Profile')).toBeInTheDocument();
    expect(screen.getByText('Team Calendar')).toBeInTheDocument();
  });

  test('able to call the store functions and add user', () => {
    render(<Dashboard />);

    expect(addUserMock).toHaveBeenCalledWith({
      email: 'jason@example.com',
      name: 'Jason Whittaker',
      role: 'Frontend Developer',
      dates: [],
    });
  });
});
