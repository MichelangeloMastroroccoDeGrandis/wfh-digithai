import { UserRequest } from '../../../lib/types';

export function sortUsers(
  users: Record<string, UserRequest>,
  loggedInUserEmail: string | null
): UserRequest[] {
  return Object.values(users).sort((a, b) => {
    if (loggedInUserEmail && a.email === loggedInUserEmail) return -1;
    if (loggedInUserEmail && b.email === loggedInUserEmail) return 1;
    return a.name.localeCompare(b.name);
  });
}
