import { useState } from "react";
import { addMonths, subMonths, isSameDay } from "date-fns";
import { ScheduleCalendarHeader } from "./ScheduleCalendarHeader";
import { ScheduleDateCell } from "./ScheduleDateCell";
import { cn } from "@/lib/utils";
import { getCalendarDays, isInCurrentMonth, formatDateKey } from "@/utils/scheduleHelpers";
import type { SchedulesByDate } from "@/models/schedule.model";

interface ScheduleCalendarProps {
  schedulesByDate: SchedulesByDate;
  selectedDates: Date[];
  onDateClick: (date: Date) => void;
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export const ScheduleCalendar = ({
  schedulesByDate,
  selectedDates,
  onDateClick,
}: ScheduleCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = getCalendarDays(currentMonth);

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const handleToday = () => setCurrentMonth(new Date());

  return (
    <div className="flex flex-col h-full">
      <ScheduleCalendarHeader
        currentMonth={currentMonth}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
      />

      <div className="flex-1 bg-white border-r border-b rounded-lg overflow-hidden shadow-sm">
        <div className="grid grid-cols-7 border-l">
          {WEEKDAYS.map((day, index) => (
            <div
              key={day}
              className={cn(
                "py-3 text-center text-xs font-semibold border-t bg-gray-50",
                index === 0 && "text-red-500",
                index === 6 && "text-blue-500",
                index !== 0 && index !== 6 && "text-gray-500"
              )}
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 group">
          {days.map((date) => {
            const dateKey = formatDateKey(date);
            const isSelected = selectedDates.some((d) => isSameDay(d, date));
            const hasSchedules = !!schedulesByDate[dateKey] && schedulesByDate[dateKey].length > 0;

            return (
              <ScheduleDateCell
                key={date.toISOString()}
                date={date}
                isCurrentMonth={isInCurrentMonth(date, currentMonth)}
                isSelected={isSelected}
                hasSchedules={hasSchedules}
                onClick={onDateClick}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
