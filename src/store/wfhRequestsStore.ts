import { create } from 'zustand';
import { UserRequest } from '../lib/types';
import { createJSONStorage, persist } from 'zustand/middleware';
import { syncedStorage } from '../lib/setupStorageSync';

type WfhRequestResponse = {
  success: boolean;
  message: string;
};

export type WFHStore = {
  users: Record<string, UserRequest>;
  requestsPerDay: Record<string, string[]>;
  addUser: (user: UserRequest) => void;
  addDate: (date: string, email: string) => WfhRequestResponse;
  addDateRange: (dates: string[], email: string) => WfhRequestResponse;
  deleteDate: (date: string, email: string) => WfhRequestResponse;
  reset: () => void;
};

const MAX_REQUESTS_PER_DAY = 3;

export const useWFHStore = create(
  persist<WFHStore>(
    (set, get) => ({
      users: {},
      requestsPerDay: {},

      addUser: (user: UserRequest) => {
        set((state) => {
          const updatedUsers = { ...state.users };
          const userEmail = user.email;

          if (updatedUsers[userEmail]) {
            if (updatedUsers[userEmail].name !== user.name) {
              updatedUsers[userEmail].name = user.name;
            }
            if (updatedUsers[userEmail].role !== user.role) {
              updatedUsers[userEmail].role = user.role;
            }
          } else {
            updatedUsers[userEmail] = {
              name: user.name,
              role: user.role,
              email: userEmail,
              dates: user.dates?.length ? [...user.dates] : [],
            };

            if (user.dates?.length) {
              user.dates.forEach((date) => {
                if (!state.requestsPerDay[date]) {
                  state.requestsPerDay[date] = [];
                }
                state.requestsPerDay[date].push(userEmail);
              });
            }
          }

          return { users: updatedUsers };
        });
      },

      addDate: (date, email) => {
        const { requestsPerDay, users } = get();

        if (!users[email]) {
          return { success: false, message: 'User does not exist.' };
        }

        if (!requestsPerDay[date]) requestsPerDay[date] = [];

        if (users[email].dates.includes(date)) {
          return {
            success: false,
            message: 'You have already requested this date.',
          };
        }

        if (requestsPerDay[date].length >= MAX_REQUESTS_PER_DAY) {
          return {
            success: false,
            message: 'Maximum requests reached for this day.',
          };
        }

        set((state) => {
          const updatedRequests = {
            ...state.requestsPerDay,
            [date]: [...state.requestsPerDay[date], email],
          };
          const updatedUsers = {
            ...state.users,
            [email]: {
              ...state.users[email],
              dates: [...state.users[email].dates, date],
            },
          };
          return { requestsPerDay: updatedRequests, users: updatedUsers };
        });

        return { success: true, message: 'Date successfully added.' };
      },

      addDateRange: (dates, email) => {
        const { requestsPerDay, users } = get();

        if (!users[email]) {
          return { success: false, message: 'User does not exist.' };
        }

        const overlappingDates = dates.filter((date) =>
          users[email].dates.includes(date)
        );

        if (overlappingDates.length > 0) {
          return {
            success: false,
            message: `You already have requests on these dates: ${overlappingDates.join(
              ', '
            )}.`,
          };
        }

        const invalidDates = dates.filter(
          (date) => requestsPerDay[date]?.length >= MAX_REQUESTS_PER_DAY
        );

        if (invalidDates.length > 0) {
          return {
            success: false,
            message: `These dates have reached the maximum requests: ${invalidDates.join(
              ', '
            )}.`,
          };
        }

        set((state) => {
          const updatedRequestsPerDay = { ...state.requestsPerDay };
          const updatedUsers = { ...state.users };

          dates.forEach((date) => {
            if (!updatedRequestsPerDay[date]) {
              updatedRequestsPerDay[date] = [];
            }
            updatedRequestsPerDay[date].push(email);
            updatedUsers[email].dates.push(date);
          });

          return { requestsPerDay: updatedRequestsPerDay, users: updatedUsers };
        });

        return { success: true, message: 'Dates successfully added.' };
      },

      deleteDate: (date, email) => {
        const { users } = get();
        if (!users[email]) {
          return { success: false, message: 'User does not exist.' };
        }

        set((state) => {
          const updatedRequests = {
            ...state.requestsPerDay,
            [date]: state.requestsPerDay[date].filter((e) => e !== email),
          };
          const updatedUsers = {
            ...state.users,
            [email]: {
              ...state.users[email],
              dates: state.users[email].dates.filter((d) => d !== date),
            },
          };

          return { requestsPerDay: updatedRequests, users: updatedUsers };
        });

        return { success: true, message: 'Date successfully deleted.' };
      },

      reset: () =>
        set({
          users: {},
          requestsPerDay: {},
        }),
    }),

    {
      name: 'wfh-store',
      storage: createJSONStorage(() => syncedStorage), // Sync the storagey
    }
  )
);
