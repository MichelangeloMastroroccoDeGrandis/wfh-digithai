export function Sidebar() {
  return (
    <aside className='sidebar w-64 bg-gray-800 text-white p-4'>
      <h2 className='text-xl font-bold mb-4'>Menu</h2>
      <ul className='space-y-4'>
        <li className='cursor-pointer hover:text-secondary'>Dashboard</li>
        <li className='text-gray-300'>Other Area</li>
        <li className='text-gray-300'>Other Area 2</li>
      </ul>
    </aside>
  );
}
