import { isSameDay } from 'date-fns';

import { cn } from '@/lib/utils';
import type { SchedulesByDate } from '@/models/schedule.model';
import { getCalendarDays, isInCurrentMonth, formatDateKey } from '@/utils/scheduleHelpers';

import { ScheduleCalendarHeader } from './ScheduleCalendarHeader';
import { ScheduleDateCell } from './ScheduleDateCell';

interface ScheduleCalendarProps {
	currentMonth: Date;
	onPrevMonth: () => void;
	onNextMonth: () => void;
	onToday: () => void;
	onSelectWeekdays: () => void;
	onSelectWeekends: () => void;
	onDeselectAll: () => void;
	schedulesByDate: SchedulesByDate;
	selectedDates: Date[];
	onDateClick: (date: Date) => void;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export const ScheduleCalendar = ({
	currentMonth,
	onPrevMonth,
	onNextMonth,
	onToday,
	onSelectWeekdays,
	onSelectWeekends,
	onDeselectAll,
	schedulesByDate,
	selectedDates,
	onDateClick,
}: ScheduleCalendarProps) => {
	const days = getCalendarDays(currentMonth);

	return (
		<div className="flex flex-col h-full">
			<ScheduleCalendarHeader
				currentMonth={currentMonth}
				onPrevMonth={onPrevMonth}
				onNextMonth={onNextMonth}
				onToday={onToday}
				onSelectWeekdays={onSelectWeekdays}
				onSelectWeekends={onSelectWeekends}
				onDeselectAll={onDeselectAll}
				hasSelectedDates={selectedDates.length > 0}
			/>

			<div className="flex-1 bg-white border-r border-b rounded-lg overflow-hidden shadow-sm">
				<div className="grid grid-cols-7 border-l">
					{WEEKDAYS.map((day, index) => (
						<div
							key={day}
							className={cn(
								'py-3 text-center text-xs font-semibold border-t bg-gray-50',
								index === 0 && 'text-red-500',
								index === 6 && 'text-blue-500',
								index !== 0 && index !== 6 && 'text-gray-500',
							)}
						>
							{day}
						</div>
					))}
				</div>

				<div className="grid grid-cols-7">
					{days.map((date) => {
						const dateKey = formatDateKey(date);
						const daySchedules = schedulesByDate[dateKey] || [];
						const isSelected = selectedDates.some((d) => isSameDay(d, date));
						const hasSchedules = daySchedules.length > 0;
						const hasParticipants = daySchedules.some((s) => s.currentParticipants > 0);

						return (
							<ScheduleDateCell
								key={date.toISOString()}
								date={date}
								isCurrentMonth={isInCurrentMonth(date, currentMonth)}
								isSelected={isSelected}
								hasSchedules={hasSchedules}
								hasParticipants={hasParticipants}
								onClick={onDateClick}
							/>
						);
					})}
				</div>
			</div>
		</div>
	);
};
