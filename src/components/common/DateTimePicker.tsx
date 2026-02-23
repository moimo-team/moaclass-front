import { useState } from 'react';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface DateTimePickerProps {
	date?: Date;
	hour: string;
	minute: string;
	period: 'AM' | 'PM';
	onDateChange: (date: Date | undefined) => void;
	onHourChange: (hour: string) => void;
	onMinuteChange: (minute: string) => void;
	onPeriodChange: (period: 'AM' | 'PM') => void;
}

function DateTimePicker({
	date,
	hour,
	minute,
	period,
	onDateChange,
	onHourChange,
	onMinuteChange,
	onPeriodChange,
}: DateTimePickerProps) {
	const [open, setOpen] = useState(false);

	const handleDateSelect = (selectedDate: Date | undefined) => {
		onDateChange(selectedDate);
		setOpen(false);
	};

	return (
		<div className="space-y-3">
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						className={cn(
							'w-full h-12 justify-start text-left font-normal',
							!date && 'text-muted-foreground',
						)}
					>
						<CalendarIcon className="mr-2 h-4 w-4 text-primary" />
						{date ? (
							format(date, 'PPP', { locale: ko })
						) : (
							<span>날짜를 선택하세요</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent
					className="w-[var(--radix-popover-trigger-width)] p-3"
					align="start"
				>
					<Calendar
						mode="single"
						selected={date}
						onSelect={handleDateSelect}
						disabled={(date) => date < new Date()}
						className="w-full [--cell-size:clamp(2.25rem,calc((var(--radix-popover-trigger-width)-2rem-0.75rem)/7),3rem)]"
						classNames={{ root: 'w-full' }}
					/>
				</PopoverContent>
			</Popover>

			<div className="flex items-center gap-3">
				<div className="w-24">
					<Select
						value={period}
						onValueChange={(value) => onPeriodChange(value as 'AM' | 'PM')}
					>
						<SelectTrigger className="h-12">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="AM">오전</SelectItem>
							<SelectItem value="PM">오후</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="flex-1">
					<Select value={hour} onValueChange={onHourChange}>
						<SelectTrigger className="h-12">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
								<SelectItem key={hour} value={hour.toString()}>
									{hour}시
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="flex-1">
					<Select value={minute} onValueChange={onMinuteChange}>
						<SelectTrigger className="h-12">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{Array.from({ length: 6 }, (_, i) => i * 10).map((minute) => (
								<SelectItem key={minute} value={minute.toString().padStart(2, '0')}>
									{minute.toString().padStart(2, '0')}분
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>
		</div>
	);
}

export default DateTimePicker;
