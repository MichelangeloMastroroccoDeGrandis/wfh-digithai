import { eachDayOfInterval, format } from 'date-fns';

export const CALENDAR_DAY_MAPPING: {
  [key in
    | '2024-12-23'
    | '2024-12-24'
    | '2024-12-25'
    | '2024-12-26'
    | '2024-12-27'
    | '2024-12-28'
    | '2024-12-29']: string;
} = {
  '2024-12-23': 'monday',
  '2024-12-24': 'tuesday',
  '2024-12-25': 'wednesday',
  '2024-12-26': 'thursday',
  '2024-12-27': 'friday',
  '2024-12-28': 'saturday',
  '2024-12-29': 'sunday',
};

export const ALLOWED_DATES = [
  new Date('2024-12-23'),
  new Date('2024-12-24'),
  new Date('2024-12-25'),
  new Date('2024-12-26'),
  new Date('2024-12-27'),
  new Date('2024-12-28'),
  new Date('2024-12-29')
];

export const START_DATE = new Date('2024-12-23');

// Checks if a given date is allowed based on the provided allowed dates.
export const isDateAllowed = (date: Date, allowedDates: Date[]): boolean => {
  return allowedDates.some(
    (allowedDate) => allowedDate.toDateString() === date.toDateString()
  );
};

// Generates an array of allowed date strings between start and end dates.
export const generateDateRange = (
  start: Date,
  end: Date,
  allowedDates: Date[]
): string[] => {
  const range = eachDayOfInterval({ start, end });
  return range
    .filter((date) => isDateAllowed(date, allowedDates))
    .map((date) => format(date, 'yyyy-MM-dd'));
};

// Gets the week dates starting from the provided start date.
export function getWeekDates(startDate: Date): string[] {
  return Array.from({ length: 5 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    return date.toISOString().slice(0, 10);
  });
}
