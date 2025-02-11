const tableHead = [
  'User',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

type TableHeaderProps = {
  weekDates: string[];
};

export function TableHeader({ weekDates }: TableHeaderProps) {
  return (
    <tr className='bg-gray-200 text-left'>
      <th className='border p-2 w-1/8'>User</th>
      {weekDates.map((date, index) => (
        <th key={index} className='border p-2'>
          {tableHead[index + 1]} <br />
          <span className='text-xs text-gray-500'>{date}</span>
        </th>
      ))}
    </tr>
  );
}
