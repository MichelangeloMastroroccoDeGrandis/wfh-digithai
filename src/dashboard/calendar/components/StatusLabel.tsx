type StatusLabelProps = {
  status: string;
  isClickable: boolean;
};

export function StatusLabel({ status, isClickable }: StatusLabelProps) {
  if (status === 'WFH Requested' && isClickable) {
    return (
      <span className='group text-xs p-2 h-[30px] rounded-full bg-green-300 text-green-700 hover:bg-red-500 hover:text-white hover:font-bold relative flex items-center justify-center transition-colors duration-300'>
        <span className='absolute transition-opacity duration-300 group-hover:opacity-0'>
          WFH Request
        </span>
        <span className='absolute opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
          Delete Request
        </span>
      </span>
    );
  }

  if (status === 'WFH Requested' && !isClickable) {
    return (
      <span className='group text-xs p-2 h-[30px] rounded-full bg-green-300 text-green-700 relative flex items-center justify-center'>
        <span className='absolute transition-opacity duration-300'>
          WFH Request
        </span>
      </span>
    );
  }

  if (status === '') {
    return (
      <span className='text-xs p-2 rounded-full bg-blue-200 text-blue-600'>
        In Office
      </span>
    );
  }

  return null;
}
