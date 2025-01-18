import { format } from 'date-fns';

export function fDateTime(date: string | Date | null, newFormat: string = 'dd MMM yyyy'): string {
  if (!date) return '';
  const parsedDate = new Date(date);
  return format(parsedDate, newFormat);
}
