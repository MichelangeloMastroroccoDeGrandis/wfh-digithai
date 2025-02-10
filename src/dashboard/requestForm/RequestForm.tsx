import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { Button } from '../../components/Button';
import {
  ALLOWED_DATES,
  generateDateRange,
  isDateAllowed,
} from '../../lib/dateHelper';
import { useWFHStore } from '../../store/wfhRequestsStore';
import { useRequireAuth } from '../../hooks/useRequestAuth';
import 'react-datepicker/dist/react-datepicker.css';

export function RequestForm() {
  const user = useRequireAuth();
  const { addDateRange } = useWFHStore();

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (startDate && endDate) {
      const dateRange = generateDateRange(startDate, endDate, ALLOWED_DATES);
      const callAddDate = addDateRange(dateRange, user?.email ?? '');
      if (callAddDate.success) {
        setStartDate(null);
        setEndDate(null);
      }
      alert(callAddDate.message);
    } else {
      alert('Please select a valid start and end date.');
    }
  };

  return (
    <div className='col-span-1 component p-6 rounded shadow'>
      <h3 className='text-lg font-semibold mb-4 text-primary'>
        Book Work From Home
      </h3>
      <form onSubmit={handleFormSubmit}>
        <div className='mb-4'>
          <label
            className='block text-sm font-medium text-secondary'
            htmlFor='start-date'
          >
            Start Date:
          </label>
          <DatePicker
            id='start-date'
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            filterDate={(date) => isDateAllowed(date, ALLOWED_DATES)}
            placeholderText='Select Start Date'
            maxDate={endDate || undefined}
            className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-sm font-medium text-secondary'
            htmlFor='end-date'
          >
            End Date:
          </label>
          <DatePicker
            id='end-date'
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            filterDate={(date) => isDateAllowed(date, ALLOWED_DATES)}
            placeholderText='Select End Date'
            minDate={startDate || undefined}
            className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          />
        </div>
        <Button type='submit' text='Submit' variant='default' />
      </form>
    </div>
  );
}
