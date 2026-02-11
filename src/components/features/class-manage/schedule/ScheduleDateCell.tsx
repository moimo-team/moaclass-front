import { isToday as isDateToday } from "date-fns";
import { cn } from "@/lib/utils";

interface ScheduleDateCellProps {
  date: Date;
  isCurrentMonth: boolean;
  isSelected: boolean;
  hasSchedules: boolean;
  onClick: (date: Date) => void;
}

export const ScheduleDateCell = ({
  date,
  isCurrentMonth,
  isSelected,
  hasSchedules,
  onClick,
}: ScheduleDateCellProps) => {
  const isToday = isDateToday(date);
  const day = date.getDate();

  return (
    <div
      onClick={() => onClick(date)}
      className={cn(
        "relative h-24 p-2 border-t border-l cursor-pointer transition-all duration-200",
        !isCurrentMonth && "bg-gray-50 text-gray-300",
        isCurrentMonth && "bg-white text-gray-700 hover:bg-blue-50/50",
        isSelected && "bg-blue-50 ring-2 ring-primary ring-inset z-10"
      )}
    >
      <div className="flex justify-between items-start">
        <span
          className={cn(
            "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full leading-none",
            isToday && "bg-primary text-white font-bold",
            !isToday && isCurrentMonth && "text-gray-700",
            !isToday && !isCurrentMonth && "text-gray-300"
          )}
        >
          {day}
        </span>

        {hasSchedules && (
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          </div>
        )}
      </div>

      {hasSchedules && (
        <div className="mt-2 space-y-1 overflow-hidden">
          <div className="px-1.5 py-0.5 bg-blue-100 text-[10px] text-blue-700 rounded truncate font-medium">
            등록된 일정 있음
          </div>
        </div>
      )}
    </div>
  );
};
