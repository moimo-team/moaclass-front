import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface ScheduleCalendarHeaderProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export const ScheduleCalendarHeader = ({
  currentMonth,
  onPrevMonth,
  onNextMonth,
  onToday,
}: ScheduleCalendarHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-gray-900">
          {format(currentMonth, "yyyy년 M월")}
        </h2>
        <div className="flex border rounded-lg overflow-hidden bg-white shadow-sm">
          <button
            onClick={onPrevMonth}
            className="p-1.5 hover:bg-gray-50 border-r transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={onNextMonth}
            className="p-1.5 hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onToday}
        className="font-medium text-gray-600 border-gray-300 hover:bg-gray-50"
      >
        오늘
      </Button>
    </div>
  );
};
