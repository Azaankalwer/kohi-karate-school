import { format } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';

const TIMEZONE = 'Pacific/Auckland';

export function getNZDateTime() {
  const utcDate = new Date();
  return utcToZonedTime(utcDate, TIMEZONE);
}

export function formatNZTime(date: Date) {
  const nzDate = utcToZonedTime(date, TIMEZONE);
  return format(nzDate, 'HH:mm:ss');
}

export function formatNZDate(date: Date | string) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const nzDate = utcToZonedTime(dateObj, TIMEZONE);
  return format(nzDate, 'dd/MM/yy');
}

export function getNZDateTimeString() {
  const nzDate = getNZDateTime();
  return {
    date: format(nzDate, 'yyyy-MM-dd'),
    time: formatNZTime(nzDate)
  };
}