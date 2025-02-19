
import { format, addDays } from 'date-fns';

// A simple function to generate the weekdays for the next 14 days
const generateNextWeekDays = () => {
  const days: Record<string, string> = {};
  let mondayCount = 0;

  for (let i = 0; i < 14; i++) {
    const date = addDays(new Date(), i);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

    days[format(date, 'yyyy-MM-dd')] = dayName;

    if (dayName === 'Friday') {
      mondayCount++;
    }

    if (mondayCount === 2) break;
  }

  return days;
};

export const NEXT_DAYS = generateNextWeekDays();

export const TableHeader = () => (
  <tr className="bg-gray-200 text-left">
    <th className="border p-2 w-1/8">User</th>
    {Object.entries(NEXT_DAYS).map(([date, day]) => (
      <th key={date} className="border p-2">
        {day} <br />
        <span className="text-xs text-gray-500">{date}</span>
      </th>
    ))}
  </tr>
);
