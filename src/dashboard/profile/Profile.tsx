import { useAuth } from '../../providers/UserAuthProvider';

export function Profile() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className='component p-6 rounded shadow text-primary text-center'>
      <h3 className='text-lg font-bold mb-6'>User Profile</h3>
      <p className='text-secondary mb-2'>
        <span className='font-semibold'>Name:</span> {user.name}
      </p>
      <p className='text-secondary mb-2'>
        <span className='font-semibold'>Email:</span> {user.email}
      </p>
      <p className='text-secondary'>
        <span className='font-semibold'>Role:</span> {user.role}
      </p>
    </div>
  );
}
