import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { RequestForm } from './RequestForm';
import { useWFHStore } from '../../store/wfhRequestsStore';
import { useRequireAuth } from '../../hooks/useRequestAuth';

jest.mock('../../store/wfhRequestsStore', () => ({
  useWFHStore: jest.fn(),
}));

jest.mock('../../hooks/useRequestAuth', () => ({
  useRequireAuth: jest.fn(),
}));

describe('RequestForm', () => {
  const mockAddDateRange = jest.fn();
  const mockUser = { email: 'test@example.com' };

  beforeEach(() => {
    (useWFHStore as unknown as jest.Mock).mockReturnValue({
      addDateRange: mockAddDateRange,
    });

    (useRequireAuth as jest.Mock).mockReturnValue(mockUser);
    mockAddDateRange.mockReset();
  });
  test('renders the form with all fields and submit button', () => {
    render(<RequestForm />);

    expect(
      screen.getByRole('heading', { name: /book work from home/i })
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/start date:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end date:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test('opens the date picker and selects a start date and end date', async () => {
    render(<RequestForm />);
    const user = userEvent.setup();

    const startDateInput = screen.getByLabelText(/start date:/i);
    const endDateInput = screen.getByLabelText(/end date:/i);

    await user.click(startDateInput);
    await user.type(startDateInput, '2024-12-24');
    expect(startDateInput).toHaveValue('2024-12-24');

    await user.click(endDateInput);
    await user.type(endDateInput, '2024-12-26');
    expect(endDateInput).toHaveValue('2024-12-26');
  });

  test('displays an alert if dates are not selected', async () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    render(<RequestForm />);
    const user = userEvent.setup();

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith(
        'Please select a valid start and end date.'
      )
    );

    (window.alert as jest.Mock).mockRestore();
  });

  test('calls addDateRange with correct arguments and resets fields on success', async () => {
    mockAddDateRange.mockReturnValue({
      success: true,
      message: 'Request submitted successfully!',
    });
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(<RequestForm />);
    const user = userEvent.setup();

    const startDateInput = screen.getByLabelText(/start date:/i);
    const endDateInput = screen.getByLabelText(/end date:/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await user.type(startDateInput, '2024-12-24');
    await user.type(endDateInput, '2024-12-26');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockAddDateRange).toHaveBeenCalledWith(
        ['2024-12-24', '2024-12-25', '2024-12-26'],
        'test@example.com'
      );
      expect(window.alert).toHaveBeenCalledWith(
        'Request submitted successfully!'
      );
    });

    expect(startDateInput).toHaveValue('');
    expect(endDateInput).toHaveValue('');

    (window.alert as jest.Mock).mockRestore();
  });

  test('shows an error message if addDateRange fails', async () => {
    mockAddDateRange.mockReturnValue({
      success: false,
      message: 'Failed to submit request.',
    });
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(<RequestForm />);
    const user = userEvent.setup();

    const startDateInput = screen.getByLabelText(/start date:/i);
    const endDateInput = screen.getByLabelText(/end date:/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await user.type(startDateInput, '2024-12-24');
    await user.type(endDateInput, '2024-12-26');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockAddDateRange).toHaveBeenCalledWith(
        ['2024-12-24', '2024-12-25', '2024-12-26'],
        'test@example.com'
      );
      expect(window.alert).toHaveBeenCalledWith('Failed to submit request.');
    });

    (window.alert as jest.Mock).mockRestore();
  });
});
