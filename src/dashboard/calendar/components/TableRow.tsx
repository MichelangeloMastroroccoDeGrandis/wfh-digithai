import { StatusCell } from './StatusCell';
import { CalendarDataType } from '../../../lib/types';
import { CALENDAR_DAY_MAPPING } from '../../../lib/dateHelper';

type TableRowProps = {
  entry: CalendarDataType;
  userEmail: string | null;
  weekDates: string[];
  onClick: (day: string, action: 'add' | 'delete') => void;
};

export function TableRow({
  entry,
  userEmail,
  weekDates,
  onClick,
}: TableRowProps) {
  const isUser = userEmail === entry.email;

  return (
    <tr className='odd:bg-white even:bg-gray-50}' role='row'>
      <td
        className={`border p-2 ${
          isUser ? 'font-bold text-blue-700' : 'text-secondary'
        }`}
      >
        <div className='h-10 max-h-10 overflow-hidden flex items-center px-2'>
          <div className='line-clamp-2 text-sm'>{entry.user}</div>
        </div>
      </td>

      {weekDates.map((date, index) => {
        const dayName =
          CALENDAR_DAY_MAPPING[date as keyof typeof CALENDAR_DAY_MAPPING];
        const status = entry[dayName as keyof CalendarDataType];
        const isClickable = isUser;

        return (
          <StatusCell
            key={index}
            status={status}
            isClickable={isClickable}
            onClick={(action) => onClick(date, action)}
          />
        );
      })}
    </tr>
  );
}
