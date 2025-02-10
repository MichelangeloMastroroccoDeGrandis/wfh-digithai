import { useEffect, useMemo, useState } from 'react';
import { useFetchCalendarData } from '../../api/userdata';
import { getWeekDates, START_DATE } from '../../lib/dateHelper';
import { CalendarDataType, UserRequest } from '../../lib/types';
import { useWFHStore } from '../../store/wfhRequestsStore';
import { sortUsers } from './helpers/helper';
import { useRequireAuth } from '../../hooks/useRequestAuth';
import { TableHeader } from './components/TableHeader';
import { TableRow } from './components/TableRow';

const API_URL =
  process.env.MOCK_JSON_API ||
  'https://run.mocky.io/v3/4afd8136-27e3-4f15-bcc9-39ab3023f459';

export function CalendarTable() {
  const user = useRequireAuth();

  const [initialLoad, setInitialLoad] = useState(false);
  const { data, loading, error } = useFetchCalendarData(API_URL);
  const { addUser, addDate, deleteDate, users } = useWFHStore();

  const startDate = START_DATE;
  const weekDates = getWeekDates(startDate);

  const calendarData: CalendarDataType[] = useMemo(() => {
    if (!users) return [];

    const sortedUsers = sortUsers(users, user?.email ?? null);
    return sortedUsers?.map((item: UserRequest) => ({
      user: item.name,
      email: item.email,
      monday: item.dates.includes(weekDates[0]) ? 'WFH Requested' : '',
      tuesday: item.dates.includes(weekDates[1]) ? 'WFH Requested' : '',
      wednesday: item.dates.includes(weekDates[2]) ? 'WFH Requested' : '',
      thursday: item.dates.includes(weekDates[3]) ? 'WFH Requested' : '',
      friday: item.dates.includes(weekDates[4]) ? 'WFH Requested' : '',
      saturday: item.dates.includes(weekDates[5]) ? 'WFH Requested' : '',
      sunday: item.dates.includes(weekDates[6]) ? 'WFH Requested' : '',
    }));
  }, [users, user?.email, weekDates]);

  useEffect(() => {
    if (data && !initialLoad) {
      data.forEach((user: UserRequest) => {
        addUser(user);
      });
      setInitialLoad(true);
    }
  }, [data, addUser, initialLoad]);

  const handleRequestClick = (day: string, action: 'add' | 'delete') => {
    if (action === 'add') {
      const callAddDate = addDate(day, user?.email ?? '');
      alert(callAddDate.message);
    } else if (action === 'delete') {
      const callDeleteDate = deleteDate(day, user?.email ?? '');
      alert(callDeleteDate.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error && !initialLoad) {
    setInitialLoad(true);
    alert('Error fetching data from API. Please try again later.');
  }

  return (
    <div className='component p-6 rounded shadow'>
      <div className='overflow-auto'>
        <h3 className='text-lg font-semibold mb-4 text-primary'>
          Team Calendar
        </h3>
        <h4 className='text-secondary'>
          Under your name you can see the days you have requested to work from
          home. Click the appropriate day to submit a request.
        </h4>
        <h4 className='mb-4 text-secondary'>
          <strong>Hover</strong> over an existing request to remove the request.
        </h4>
        <table className='w-full min-w-[800px] table-fixed border-collapse'>
          <thead>
            <TableHeader weekDates={weekDates} />
          </thead>
          <tbody>
            {calendarData?.map((entry, index) => (
              <TableRow
                key={index}
                entry={entry}
                userEmail={user?.email ?? null}
                weekDates={weekDates}
                onClick={(day, action) => handleRequestClick(day, action)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
