export type UserRequest = {
  id?: number;
  name: string;
  email: string;
  role: string;
  dates: string[];
};

export type CalendarDataType = {
  user: string;
  email: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
};
