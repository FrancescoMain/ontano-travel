import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { formatDate, formatTime, calculateDuration, formatDateTime } from '../../utils/dateUtils';

dayjs.extend(utc);
dayjs.extend(timezone);

describe('dateUtils', () => {
  describe('formatDate', () => {
    it('should format a date correctly', () => {
      const date = '2024-03-15T10:30:00Z';
      const result = formatDate(date, 'it');
      expect(result).toMatch(/15 Mar 2024/i);
    });

    it('should handle different date inputs', () => {
      const date = new Date('2024-12-25T12:00:00Z');
      const result = formatDate(date, 'en');
      expect(result).toMatch(/25 Dec 2024/i);
    });
  });

  describe('formatTime', () => {
    it('should format time correctly in HH:mm format', () => {
      const date = '2024-03-15T14:30:00+01:00';
      const result = formatTime(date);
      expect(result).toMatch(/^\d{2}:\d{2}$/);
    });
  });

  describe('calculateDuration', () => {
    it('should calculate duration between two dates', () => {
      const departure = dayjs('2024-03-15T10:00:00');
      const arrival = dayjs('2024-03-15T12:30:00');
      const result = calculateDuration(departure, arrival);

      expect(result).toEqual({ hours: 2, minutes: 30 });
    });

    it('should handle zero duration', () => {
      const sameTime = dayjs('2024-03-15T10:00:00');
      const result = calculateDuration(sameTime, sameTime);

      expect(result).toEqual({ hours: 0, minutes: 0 });
    });

    it('should handle durations over 24 hours', () => {
      const departure = dayjs('2024-03-15T10:00:00');
      const arrival = dayjs('2024-03-16T12:00:00');
      const result = calculateDuration(departure, arrival);

      expect(result).toEqual({ hours: 26, minutes: 0 });
    });
  });

  describe('formatDateTime', () => {
    it('should return both date and time formatted', () => {
      const date = '2024-03-15T14:30:00+01:00';
      const result = formatDateTime(date, 'it');

      expect(result).toHaveProperty('date');
      expect(result).toHaveProperty('time');
      expect(result.date).toMatch(/15 Mar 2024/i);
      expect(result.time).toMatch(/^\d{2}:\d{2}$/);
    });
  });
});
