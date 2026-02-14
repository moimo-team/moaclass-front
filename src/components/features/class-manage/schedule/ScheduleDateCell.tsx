import { isToday as isDateToday } from 'date-fns';

import { cn } from '@/lib/utils';

interface ScheduleDateCellProps {
	date: Date;
	isCurrentMonth: boolean;
	isSelected: boolean;
	hasSchedules: boolean;
	hasParticipants?: boolean;
	onClick: (date: Date) => void;
}

export const ScheduleDateCell = ({
	date,
	isCurrentMonth,
	isSelected,
	hasSchedules,
	hasParticipants = false,
	onClick,
}: ScheduleDateCellProps) => {
	const isToday = isDateToday(date);
	const day = date.getDate();

	return (
		<div
			onClick={() => onClick(date)}
			className={cn(
				'relative h-24 p-2 border-t border-l cursor-pointer transition-all duration-200',
				!isCurrentMonth && 'bg-gray-50 text-gray-300',
				isCurrentMonth && 'bg-white text-gray-700 hover:bg-blue-50/50',
				isSelected && 'bg-blue-50 ring-2 ring-primary ring-inset z-10',
			)}
		>
			<div className="flex justify-between items-start">
				<span
					className={cn(
						'text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full leading-none',
						isToday && 'bg-primary text-white font-bold',
						!isToday && isCurrentMonth && 'text-gray-700',
						!isToday && !isCurrentMonth && 'text-gray-300',
					)}
				>
					{day}
				</span>

				<div className="flex gap-1">
					{hasSchedules && <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />}
					{hasParticipants && (
						<div className="w-1.5 h-1.5 rounded-full bg-carrot animate-pulse" />
					)}
				</div>
			</div>

			<div className="mt-2 space-y-1 overflow-hidden">
				{hasSchedules && (
					<div
						className={cn(
							'px-1.5 py-0.5 text-[10px] rounded truncate font-medium',
							hasParticipants
								? 'bg-carrot/10 text-carrot border border-carrot/20'
								: 'bg-primary/5 text-primary border border-primary/10',
						)}
					>
						{hasParticipants ? '신청자 있음' : '일정 있음'}
					</div>
				)}
			</div>
		</div>
	);
};
