import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { CalendarTable } from './Table';
import * as api from '../../api/userdata';
import { UserRequest } from '../../lib/types';
import { useWFHStore } from '../../store/wfhRequestsStore';
import { useAuth } from '../../providers/UserAuthProvider';
import { TableRow } from './components/TableRow';
import * as auth from '../../hooks/useRequestAuth';

jest.mock('../../providers/UserAuthProvider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../hooks/useRequestAuth', () => ({
  useRequireAuth: jest.fn(),
}));

jest.mock('../../api/userdata', () => ({
  useFetchCalendarData: jest.fn(),
}));

jest.mock('../../store/wfhRequestsStore', () => ({
  useWFHStore: jest.fn(),
}));

describe('CalendarTable', () => {
  const mockAddUser = jest.fn();
  const mockAddDate = jest.fn();
  const mockDeleteDate = jest.fn();
  const mockOnClick = jest.fn();

  const headers = [
    'User',
    'Monday 2024-12-23',
    'Tuesday 2024-12-24',
    'Wednesday 2024-12-25',
    'Thursday 2024-12-26',
    'Friday 2024-12-27',
  ];

  const weekDates = [
    '2024-12-23',
    '2024-12-24',
    '2024-12-25',
    '2024-12-26',
    '2024-12-27',
  ];

  const mockEntry = {
    user: 'Jason Targaryen',
    email: 'jason@example.com',
    monday: 'WFH Requested',
    tuesday: 'WFH Requested',
    wednesday: 'WFH Requested',
    thursday: '',
    friday: '',
  };

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

  const mockLoggedInUser = {
    name: 'Jason Whittaker',
    dates: ['2024-12-23', '2024-12-25', '2024-12-27'],
    email: 'jason@example.com',
    role: 'King of the North',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (api.useFetchCalendarData as jest.Mock).mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
    });

    (useWFHStore as unknown as jest.Mock).mockReturnValue({
      addUser: mockAddUser,
      users: [...mockData, mockLoggedInUser],
      addDate: mockAddDate,
      deleteDate: mockDeleteDate,
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
  });

  test('renders the calendar table with correct headers and mock data', () => {
    render(<CalendarTable />);

    headers.forEach((header) => {
      expect(
        screen.getByRole('columnheader', { name: header })
      ).toBeInTheDocument();
    });

    const rowLength = mockData.length + 2; // 1 for header and 1 for logged in userQ

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(rowLength);

    expect(
      screen.getByRole('row', {
        name: /Jon Snow.*WFH Request.*WFH Request/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('row', {
        name: /Daenerys Targaryen.*WFH Request.*WFH Request/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('row', {
        name: /Tyrion Lannister.*WFH Request.*WFH Request.*WFH Request/i,
      })
    ).toBeInTheDocument();
  });

  test('able to stored data with mock data', () => {
    render(<CalendarTable />);

    mockData.forEach((user) => {
      expect(mockAddUser).toHaveBeenCalledWith(user);
    });
  });

  test('handles clicks for the logged-in user and calls deleteDate', async () => {
    const user = userEvent.setup();

    (auth.useRequireAuth as jest.Mock).mockReturnValue({
      email: 'jason@example.com',
    });

    render(
      <table>
        <tbody>
          <TableRow
            entry={mockEntry}
            userEmail={'jason@example.com'}
            weekDates={weekDates}
            onClick={mockOnClick}
          />
        </tbody>
      </table>
    );

    const wfhRequestCells = screen.getAllByText('WFH Request');

    await user.click(wfhRequestCells[0]);

    expect(mockOnClick).toHaveBeenCalledWith('2024-12-23', 'delete');
  });

  test('handles clicks for the logged-in user and calls addDate', async () => {
    const user = userEvent.setup();

    (auth.useRequireAuth as jest.Mock).mockReturnValue({
      email: 'jason@example.com',
    });

    render(
      <table>
        <tbody>
          <TableRow
            entry={mockEntry}
            userEmail={'jason@example.com'}
            weekDates={weekDates}
            onClick={mockOnClick}
          />
        </tbody>
      </table>
    );

    const inOfficeCells = screen.getAllByText('In Office');

    await user.click(inOfficeCells[0]);

    expect(mockOnClick).toHaveBeenCalledWith('2024-12-26', 'add');
  });

  test('does not call addDate or deleteDate for other users', async () => {
    const user = userEvent.setup();

    (auth.useRequireAuth as jest.Mock).mockReturnValue({
      email: 'jason@example.com',
    });

    render(
      <table>
        <tbody>
          <TableRow
            entry={mockEntry}
            userEmail={'tomn@example.com'}
            weekDates={weekDates}
            onClick={mockOnClick}
          />
        </tbody>
      </table>
    );

    const inOfficeCells = screen.getAllByText('In Office');
    const wfhRequestCells = screen.getAllByText('WFH Request');

    await user.click(inOfficeCells[0]);

    expect(mockOnClick).not.toHaveBeenCalled();

    await user.click(wfhRequestCells[0]);

    expect(mockAddDate).not.toHaveBeenCalled();
    expect(mockDeleteDate).not.toHaveBeenCalled();
  });
});
