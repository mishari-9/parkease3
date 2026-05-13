'use client';
import React, { useState } from 'react';
import { Clock, CalendarDays } from 'lucide-react';

interface DateTimePickerProps {
  startTime: Date | null;
  endTime: Date | null;
  onStartChange: (d: Date) => void;
  onEndChange: (d: Date) => void;
  minDate?: Date;
}

const QUICK_DURATIONS = [
  { label: '1h', hours: 1 },
  { label: '2h', hours: 2 },
  { label: '4h', hours: 4 },
  { label: '8h', hours: 8 },
];

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  startTime,
  endTime,
  onStartChange,
  onEndChange,
  minDate = new Date(),
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const d = new Date(e.target.value);
    if (d < minDate) {
      setError('Start time cannot be in the past');
      return;
    }
    setError(null);
    onStartChange(d);
    // Auto-set end time to 1 hour later
    if (!endTime || endTime <= d) {
      const newEnd = new Date(d.getTime() + 3600000);
      onEndChange(newEnd);
    }
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const d = new Date(e.target.value);
    if (d <= (startTime || new Date())) {
      setError('End time must be after start time');
      return;
    }
    setError(null);
    onEndChange(d);
  };

  const handleQuickDuration = (hours: number) => {
    const now = startTime || new Date();
    const start = new Date(now);
    start.setMinutes(0, 0, 0);
    const end = new Date(start.getTime() + hours * 3600000);
    onStartChange(start);
    onEndChange(end);
    setError(null);
  };

  const formatDateForInput = (date: Date | null): string => {
    if (!date) return '';
    return date.toISOString().slice(0, 16);
  };

  return (
    <div className="space-y-4">
      {/* Quick Duration Buttons */}
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quick Select</p>
        <div className="flex gap-2 flex-wrap">
          {QUICK_DURATIONS.map(({ label, hours }) => (
            <button
              key={label}
              onClick={() => handleQuickDuration(hours)}
              className="px-4 py-2 text-sm font-medium rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Start Time */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
          <CalendarDays size={14} />
          Start Time
        </label>
        <input
          type="datetime-local"
          value={formatDateForInput(startTime)}
          onChange={handleStartChange}
          min={formatDateForInput(minDate)}
          className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />
      </div>

      {/* End Time */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
          <Clock size={14} />
          End Time
        </label>
        <input
          type="datetime-local"
          value={formatDateForInput(endTime)}
          onChange={handleEndChange}
          min={formatDateForInput(startTime || minDate)}
          className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>
      )}

      {/* Duration display */}
      {startTime && endTime && endTime > startTime && (
        <div className="bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-400">
            Duration: {Math.round((endTime.getTime() - startTime.getTime()) / 3600000 * 10) / 10} hours
          </p>
        </div>
      )}
    </div>
  );
};
