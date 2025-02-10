import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  test('renders the button with correct text', () => {
    render(<Button text='Login' />);
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('calls onClick handler when clicked', async () => {
    const onClickMock = jest.fn();
    const user = userEvent.setup();
    render(<Button text='Login' onClick={onClickMock} />);

    await user.click(screen.getByText('Login'));
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  test('applies the correct styles based on variant', () => {
    const { container } = render(<Button text='Login' variant='destructive' />);
    expect(container.firstChild).toHaveClass('bg-red-600 text-white rounded');
  });
  test('supports "submit" type', () => {
    render(<Button text='Login' type='submit' />);
    expect(screen.getByText('Login')).toHaveAttribute('type', 'submit');
  });
});
