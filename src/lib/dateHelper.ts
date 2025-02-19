import { eachDayOfInterval, format, addDays, startOfISOWeek } from 'date-fns';

export const START_DATE = new Date();

const getWeekDays = (startDate: Date) => {
  const days: { [key: string]: string } = {};
  const allowedDates: Date[] = [];

  for (let i = 0; i < 14; i++) {
    const currentDate = addDays(startDate, i);
    const dayString = format(currentDate, 'yyyy-MM-dd');
    const dayName = format(currentDate, 'eeee').toLowerCase();

    if (dayName !== 'saturday' && dayName !== 'sunday') {
      days[dayString] = dayName;
      allowedDates.push(currentDate);
    }
  }

  return { days, allowedDates };
};

// ✅ New function: Get weekdays for current and next week only
const getCurrentAndNextWeekDays = (startDate: Date) => {
  const days: { [key: string]: string } = {};
  const allowedDates: Date[] = [];

  const startOfWeek = startOfISOWeek(startDate); // Monday of current week
  const nextWeekEnd = addDays(startOfWeek, 13);  // Sunday of next week

  eachDayOfInterval({ start: startOfWeek, end: nextWeekEnd }).forEach((currentDate) => {
    const dayName = format(currentDate, 'eeee').toLowerCase();
    if (dayName !== 'saturday' && dayName !== 'sunday') {
      const dayString = format(currentDate, 'yyyy-MM-dd');
      days[dayString] = dayName;
      allowedDates.push(currentDate);
    }
  });

  return { days, allowedDates };
};

// ✅ Use the new function for calendar mapping and allowed dates
const { days, allowedDates } = getCurrentAndNextWeekDays(START_DATE);

export const CALENDAR_DAY_MAPPING = days;
export const ALLOWED_DATES = allowedDates;

// ✅ Checks if a given date is allowed based on the provided allowed dates.
export const isDateAllowed = (date: Date, allowedDates: Date[]): boolean => {
  return allowedDates.some(
    (allowedDate) => allowedDate.toDateString() === date.toDateString()
  );
};

// ✅ Generates an array of allowed date strings between start and end dates.
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

// ✅ Gets the next 14 days from the provided start date.
export function getWeekDates(startDate: Date): string[] {
  return Array.from({ length: 14 }, (_, i) => {
    const date = addDays(startDate, i);
    return format(date, 'yyyy-MM-dd');
  });
}
