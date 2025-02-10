import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InputField } from './InputFormFields';

describe('InputField', () => {
  test('renders the input field with the correct label', () => {
    render(
      <InputField label='Name' type='text' value='' onChange={() => {}} />
    );
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
  });

  test('displays error message when passed', () => {
    render(
      <InputField
        label='Name'
        type='text'
        value=''
        onChange={() => {}}
        error='Name is required'
      />
    );
    expect(screen.getByText('Name is required')).toBeInTheDocument();
  });

  test('calls onChange handler when text is entered', async () => {
    const onChangeMock = jest.fn();
    const user = userEvent.setup();
    render(
      <InputField label='Name' type='text' value='' onChange={onChangeMock} />
    );

    await user.type(screen.getByLabelText('Name'), 'John Doe');

    expect(onChangeMock).toHaveBeenCalled();
  });

  test('applies error styles when error is passed', () => {
    const { container } = render(
      <InputField
        label='Name'
        type='text'
        value=''
        onChange={() => {}}
        error='Name is required'
      />
    );
    expect(container.querySelector('input')).toHaveClass('border-red-500');
  });
});
