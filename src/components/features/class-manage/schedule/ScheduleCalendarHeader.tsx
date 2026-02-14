import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ScheduleCalendarHeaderProps {
	currentMonth: Date;
	onPrevMonth: () => void;
	onNextMonth: () => void;
	onToday: () => void;
	onSelectWeekdays: () => void;
	onSelectWeekends: () => void;
	onDeselectAll: () => void;
	hasSelectedDates: boolean;
}

export const ScheduleCalendarHeader = ({
	currentMonth,
	onPrevMonth,
	onNextMonth,
	onToday,
	onSelectWeekdays,
	onSelectWeekends,
	onDeselectAll,
	hasSelectedDates,
}: ScheduleCalendarHeaderProps) => {
	return (
		<div className="flex items-center justify-between mb-6">
			<div className="flex items-center gap-4">
				<h2 className="text-xl font-bold text-gray-900">
					{format(currentMonth, 'yyyy년 M월')}
				</h2>

				<div className="flex items-center border rounded-lg overflow-hidden bg-white shadow-sm h-10">
					<Button
						variant="ghost"
						size="sm"
						onClick={onPrevMonth}
						className="px-3 h-full hover:bg-gray-50 border-r rounded-none transition-colors"
					>
						<ChevronLeft className="w-4 h-4 text-gray-600" />
					</Button>
					<Button
						variant="ghost"
						size="sm"
						onClick={onToday}
						className="px-4 h-full text-xs font-bold text-gray-600 hover:bg-gray-50 border-r rounded-none transition-colors"
					>
						오늘
					</Button>
					<Button
						variant="ghost"
						size="sm"
						onClick={onNextMonth}
						className="px-3 h-full hover:bg-gray-50 rounded-none transition-colors"
					>
						<ChevronRight className="w-4 h-4 text-gray-600" />
					</Button>
				</div>
			</div>

			<div className="flex items-center gap-2">
				<div className="flex bg-gray-100/50 p-1 rounded-xl border">
					<Button
						variant="ghost"
						size="sm"
						onClick={onSelectWeekdays}
						className="h-8 text-xs font-bold px-3 hover:bg-white hover:shadow-sm"
					>
						평일
					</Button>
					<Button
						variant="ghost"
						size="sm"
						onClick={onSelectWeekends}
						className="h-8 text-xs font-bold px-3 hover:bg-white hover:shadow-sm"
					>
						주말
					</Button>
				</div>

				{hasSelectedDates && (
					<Button
						variant="outline"
						size="sm"
						onClick={onDeselectAll}
						className="h-10 px-4 rounded-xl border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600 font-bold gap-1.5 transition-all animate-in fade-in zoom-in duration-200"
					>
						<X className="w-3.5 h-3.5" />
						선택취소
					</Button>
				)}
			</div>
		</div>
	);
};
