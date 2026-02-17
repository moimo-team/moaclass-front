import { useState, useMemo } from 'react';

import { FaRegHeart, FaHeart, FaCalendarAlt } from 'react-icons/fa';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { Schedule } from '@/models/schedule.model';
import { toYYYYMMDD, formatDateToYYYYMMDD_DOT, formatTime } from '@/utils/dateFormat';

interface LessonReservationSidebarProps {
	reservationLeadDays: number;
	price: number;
	discountRate: number;
	discountedPrice: number;
	isLoggedIn: boolean;
	today: Date;
	threeMonthsLater: Date;
	schedules: Schedule[];
	onWishlistToggle: () => void;
	onInquiry: () => void;
	onApplyLesson: (scheduleId: number, headcount: number) => void;
	showLoginPrompt: (show: boolean) => void;
	maxParticipants: number;
	isLiked: boolean | undefined;
}

export const LessonReservationSidebar = ({
	reservationLeadDays,
	price,
	discountRate,
	discountedPrice,
	isLoggedIn,
	today,
	threeMonthsLater,
	schedules,
	onWishlistToggle,
	onInquiry,
	onApplyLesson,
	showLoginPrompt,
	maxParticipants,
	isLiked,
}: LessonReservationSidebarProps) => {
	const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
	const [headcount, setHeadcount] = useState(1);
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);

	const filteredSchedules = useMemo(() => {
		if (selectedDate) {
			return schedules.filter((s) => s.startAt.substring(0, 10) === selectedDate);
		}
		return [];
	}, [selectedDate, schedules]);

	const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);

	const handleDateSelect = (date: Date | undefined) => {
		if (date) {
			setSelectedDate(toYYYYMMDD(date.toISOString()));
			setSelectedScheduleId(null);
			setIsCalendarOpen(false);
		} else {
			setSelectedDate(undefined);
			setSelectedScheduleId(null);
		}
	};

	const handleHeadcountChange = (amount: number) => {
		setHeadcount((prev) => Math.max(1, Math.min(50, prev + amount)));
	};

	const handleApplyClick = () => {
		if (!isLoggedIn) {
			showLoginPrompt(true);
			return;
		}
		if (!selectedScheduleId) {
			toast.error('클래스 시간대를 선택해주세요.');
			return;
		}

		const selectedSchedule = schedules.find((s) => s.id === selectedScheduleId);

		if (!selectedSchedule) {
			toast.error('선택된 시간대의 스케줄 정보를 찾을 수 없습니다.');
			return;
		}

		const remainingSlots = maxParticipants - selectedSchedule.currentParticipants;

		if (headcount > remainingSlots) {
			toast.error(
				`선택하신 시간대의 남은 좌석은 ${remainingSlots}개입니다. 인원수를 조절해주세요.`,
			);
			return;
		}

		onApplyLesson(selectedScheduleId, headcount);
	};

	return (
		<div className="md:col-span-1">
			<div className="sticky top-12 space-y-6">
				<Card className="border-2 border-border/50 shadow-sm overflow-hidden rounded-xl p-6">
					<h2 className="text-xl md:text-2xl font-bold mb-4">클래스 예약하기</h2>

					{/* 날짜 선택 */}
					<div className="mb-2">
						<p className="text-lg font-semibold mb-2">날짜 선택</p>
						<Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
							<PopoverTrigger asChild>
								<Button
									variant={'outline'}
									className={cn(
										'w-full justify-start text-left font-normal h-12 text-base',
										!selectedDate && 'text-muted-foreground',
									)}
								>
									<FaCalendarAlt className="mr-2 h-4 w-4 text-primary" />
									{selectedDate
										? formatDateToYYYYMMDD_DOT(selectedDate)
										: '날짜 선택'}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-4" align="start">
								<Calendar
									mode="single"
									selected={selectedDate ? new Date(selectedDate) : undefined}
									onSelect={handleDateSelect}
									initialFocus
									disabled={(date) => date < today || date > threeMonthsLater}
									numberOfMonths={2}
								/>
							</PopoverContent>
						</Popover>
					</div>

					{/* 스케줄 리스트 */}
					{filteredSchedules.length > 0 && (
						<div className="mb-6 space-y-2 border rounded-md p-4">
							<p className="text-lg font-semibold mb-2">시간 선택</p>
							<div className="max-h-48 overflow-y-auto pr-2">
								{filteredSchedules.map((schedule) => (
									<Button
										key={schedule.id}
										variant={
											selectedScheduleId === schedule.id
												? 'secondary'
												: 'outline'
										}
										className="w-full justify-between h-auto py-2 px-4 mb-2"
										onClick={() => setSelectedScheduleId(schedule.id)}
									>
										<span className="text-base">
											{formatTime(schedule.startAt)} ~{' '}
											{formatTime(schedule.endAt)}
										</span>
										<span
											className={cn(
												'text-sm',
												selectedScheduleId === schedule.id
													? 'text-secondary-foreground'
													: 'text-muted-foreground',
											)}
										>
											{schedule.currentParticipants} / {maxParticipants}명
										</span>
									</Button>
								))}
							</div>
						</div>
					)}

					<div className="bg-secondary/20 p-4 rounded-md mb-6">
						<p className="text-xs sm:text-sm text-muted-foreground">
							최소 예약 {reservationLeadDays}일 전 예약 가능합니다.
						</p>
						<p className="text-xs sm:text-sm text-muted-foreground">
							인원별 할인 정책은 현재 적용되지 않습니다.
						</p>
					</div>

					<div className="mb-6">
						<p className="text-lg font-semibold mb-2">인원 선택</p>
						<div className="flex items-center justify-between border rounded-md p-2">
							<Button
								variant="ghost"
								size="icon"
								onClick={() => handleHeadcountChange(-1)}
								disabled={headcount <= 1}
							>
								-
							</Button>
							<Input
								type="number"
								value={headcount}
								readOnly
								className="w-16 text-center text-lg font-semibold border-none focus-visible:ring-0"
							/>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => handleHeadcountChange(1)}
								disabled={headcount >= 50}
							>
								+
							</Button>
						</div>
					</div>

					<div className="text-right mb-4">
						{discountRate > 0 && (
							<div className="flex items-center justify-end gap-2 text-muted-foreground line-through text-sm">
								<span>{price.toLocaleString()}원</span>
								<span className="text-red-500 font-semibold">{discountRate}%</span>
							</div>
						)}
						<div className="text-3xl font-bold text-primary">
							{(discountedPrice * headcount).toLocaleString()}원
						</div>
						<p className="text-sm text-muted-foreground mt-1">({headcount}명 기준)</p>
					</div>

					<div className="flex flex-wrap gap-3">
						<Button
							variant="outline"
							className="w-full py-6 text-lg sm:w-auto sm:flex-grow"
							onClick={onWishlistToggle}
						>
							{isLiked ? (
								<FaHeart className="mr-2 text-xl text-red-500" />
							) : (
								<FaRegHeart className="mr-2 text-xl" />
							)}
							위시리스트
						</Button>
						<Button
							variant="secondary"
							className="w-full py-6 text-lg sm:w-auto sm:flex-grow"
							onClick={onInquiry}
						>
							문의하기
						</Button>
					</div>
					<Button
						className="w-full text-lg py-6 bg-primary text-primary-foreground hover:bg-primary/90 mt-3"
						onClick={handleApplyClick}
						disabled={!selectedScheduleId}
					>
						클래스 신청
					</Button>
				</Card>
			</div>
		</div>
	);
};
