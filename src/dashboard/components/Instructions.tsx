export function Instructions() {
  return (
    <div className='p-6 component rounded shadow bg-gray-50'>
      <h3 className='text-lg font-semibold mb-4 text-primary'>Instructions</h3>
      <p className='text-secondary mb-4'>
        Please select the dates you wish to request to work from home in the
        form to the right. Otherwise, click on the individual day in the team
        calendar below.
      </p>
      <p className='text-secondary'>
        <strong>Note:</strong> Only <strong>3 people</strong> are allowed to
        work from home per day.
      </p>
    </div>
  );
}
