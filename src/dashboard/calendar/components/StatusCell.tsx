import { StatusLabel } from './StatusLabel';

type StatusCellProps = {
  status: string;
  isClickable: boolean;
  onClick: (action: 'add' | 'delete') => void;
};

export function StatusCell({ status, isClickable, onClick }: StatusCellProps) {
  const cellClasses = [
    'border',
    'p-2',
    'text-center',
    isClickable ? 'cursor-pointer hover:bg-green-200' : 'cursor-not-allowed',
    status === 'WFH Requested'
      ? 'text-green-600'
      : status === ''
      ? 'text-blue-600'
      : 'bg-gray-200 text-gray-500',
  ].join(' ');

  const handleClick = () => {
    if (isClickable) {
      // Call appropriate handler based on status
      onClick(status === 'WFH Requested' ? 'delete' : 'add');
    }
  };

  return (
    <td className={cellClasses} onClick={handleClick}>
      <StatusLabel status={status} isClickable={isClickable} />
    </td>
  );
}
