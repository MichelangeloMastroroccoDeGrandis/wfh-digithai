import { eachDayOfInterval, format, addDays } from 'date-fns';

export const START_DATE = new Date();

const getWeekDays = (startDate: Date) => {
  const days: { [key: string]: string } = {};
  const allowedDates: Date[] = [];

  for (let i = 0; i < 14; i++) {
    const currentDate = addDays(startDate, i);
    const dayString = format(currentDate, 'yyyy-MM-dd');
    const dayName = format(currentDate, 'eeee').toLowerCase();

    if(dayName === 'saturday' || dayName === 'sunday') {

    // do nothing

    } else {
      days[dayString] = dayName;
      allowedDates.push(currentDate);
    }
    
    console.log(dayString, dayName);

    
  }

  return { days, allowedDates };
};


const { days, allowedDates } = getWeekDays(START_DATE);

export const CALENDAR_DAY_MAPPING = days;
export const ALLOWED_DATES = allowedDates;

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
  return Array.from({ length: 14 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    return date.toISOString().slice(0, 10);
  });
}
