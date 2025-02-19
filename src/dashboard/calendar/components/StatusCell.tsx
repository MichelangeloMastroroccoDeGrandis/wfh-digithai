import { StatusLabel } from './StatusLabel';

type StatusCellProps = {
  status: string;
  dayName: string; 
  isClickable: boolean;
  onClick: (action: 'add' | 'delete') => void;
};

export function StatusCell({ status, isClickable, dayName, onClick }: StatusCellProps) {
  // ⛔ Disable clicks if it's Saturday or Sunday
  const isWeek = dayName === 'monday' || dayName === 'tuesday' || dayName === 'wednesday' || dayName === 'thursday' || dayName === 'friday';
  const clickable = isClickable && isWeek;

  const cellClasses = [
    'border',
    'p-2',
    'text-center',
    clickable ? 'cursor-pointer hover:bg-green-200' : 'cursor-not-allowed',
    status === 'WFH Requested'
      ? 'text-green-600'
      : status === ''
      ? 'text-blue-600'
      : 'bg-gray-200 text-gray-500',
  ].join(' ');

  const handleClick = () => {
    if (clickable) {
      onClick(status === 'WFH Requested' ? 'delete' : 'add');
    }
  };

  return (
    <td className={cellClasses} onClick={handleClick}>
      <StatusLabel status={status} isClickable={clickable} />
    </td>
  );
}
