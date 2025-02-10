import { CalendarTable } from './calendar';
import { Profile } from './profile';
import { RequestForm } from './requestForm';
import { Sidebar } from './sidebar';
import { Header } from './components/Header';
import { useRequireAuth } from '../hooks/useRequestAuth';
import { useWFHStore } from '../store/wfhRequestsStore';
import { useEffect, useState } from 'react';
import { Instructions } from './components/Instructions';

export function Dashboard() {
  const user = useRequireAuth();
  const { addUser } = useWFHStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && !isInitialized) {
      setIsLoading(true);
      addUser({
        email: user.email,
        name: user.name,
        role: user.role,
        dates: [],
      });
      setIsInitialized(true);
      setIsLoading(false);
    }
  }, [user, addUser, isInitialized]);

  if (!user) {
    return null;
  }

  return (
    <>
      <Header />
      <div className='flex flex-1'>
        <Sidebar />
        <main className='flex-1 p-6 bg-background'>
          <div className='grid grid-cols-3 gap-6 mb-6'>
            <Instructions />
            <RequestForm />
            <Profile />
          </div>
          {!isLoading && <CalendarTable />}
        </main>
      </div>
    </>
  );
}
