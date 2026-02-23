import { useEffect, useMemo, useState } from 'react';

import { CalendarIcon } from 'lucide-react';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { Schedule } from '@/models/schedule.model';
import {
	formatDateKeyLocal,
	formatDateToYYYYMMDD_DOT,
	formatTime,
	toYYYYMMDD,
} from '@/utils/dateFormat';

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
	isOwnedByCurrentUser: boolean;
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
	isOwnedByCurrentUser,
}: LessonReservationSidebarProps) => {
	const parseDateKeyToDate = (dateKey: string): Date => {
		const [year, month, day] = dateKey.split('-').map(Number);
		return new Date(year, month - 1, day);
	};

	const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
	const [headcount, setHeadcount] = useState(1);
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);
	const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);

	const availableScheduleDates = useMemo(
		() =>
			new Set(
				schedules
					.filter((schedule) => schedule.status === 'RECRUITING')
					.map((schedule) => toYYYYMMDD(schedule.startAt)),
			),
		[schedules],
	);

	const filteredSchedules = useMemo(() => {
		if (selectedDate) {
			return schedules.filter((s) => s.startAt.substring(0, 10) === selectedDate);
		}
		return [];
	}, [selectedDate, schedules]);

	const selectedSchedule = useMemo(
		() => schedules.find((schedule) => schedule.id === selectedScheduleId) ?? null,
		[schedules, selectedScheduleId],
	);
	const selectedScheduleRemainingSlots = useMemo(() => {
		if (!selectedSchedule) {
			return null;
		}
		return Math.max(0, maxParticipants - selectedSchedule.currentParticipants);
	}, [maxParticipants, selectedSchedule]);
	const effectiveHeadcountMax = selectedScheduleRemainingSlots ?? maxParticipants;

	const handleDateSelect = (date: Date | undefined) => {
		if (date) {
			setSelectedDate(formatDateKeyLocal(date));
			setSelectedScheduleId(null);
			setIsCalendarOpen(false);
		} else {
			setSelectedDate(undefined);
			setSelectedScheduleId(null);
		}
	};

	const handleHeadcountChange = (amount: number) => {
		setHeadcount((prev) => Math.max(1, Math.min(effectiveHeadcountMax, prev + amount)));
	};

	useEffect(() => {
		if (effectiveHeadcountMax <= 0) {
			if (headcount !== 1) setHeadcount(1);
			return;
		}

		if (headcount > effectiveHeadcountMax) {
			setHeadcount(effectiveHeadcountMax);
		}
	}, [effectiveHeadcountMax, headcount]);

	const handleApplyClick = () => {
		if (isOwnedByCurrentUser) {
			return;
		}
		if (!isLoggedIn) {
			showLoginPrompt(true);
			return;
		}
		if (!selectedScheduleId) {
			toast.error('클래스 시간대를 선택해주세요.');
			return;
		}

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
									<CalendarIcon className="mr-2 h-4 w-4 text-primary" />
									{selectedDate
										? formatDateToYYYYMMDD_DOT(selectedDate)
										: '날짜 선택'}
								</Button>
							</PopoverTrigger>
							<PopoverContent
								className="w-[var(--radix-popover-trigger-width)] p-3"
								align="start"
							>
								<Calendar
									mode="single"
									className="w-full [--cell-size:clamp(2.25rem,calc((var(--radix-popover-trigger-width)-2rem-0.75rem)/7),3rem)]"
									classNames={{ root: 'w-full' }}
									selected={
										selectedDate ? parseDateKeyToDate(selectedDate) : undefined
									}
									onSelect={handleDateSelect}
									initialFocus
									disabled={(date) => date < today || date > threeMonthsLater}
									modifiers={{
										hasSchedule: (date) =>
											availableScheduleDates.has(formatDateKeyLocal(date)),
									}}
									numberOfMonths={1}
								/>
							</PopoverContent>
						</Popover>
					</div>

					{/* 스케줄 리스트 */}
					{selectedDate && (
						<div className="mb-6 space-y-2 border rounded-md p-4">
							<p className="text-lg font-semibold mb-2">시간 선택</p>
							{filteredSchedules.length > 0 ? (
								<div className="max-h-48 overflow-y-auto pr-2">
									{filteredSchedules.map((schedule) => (
										<Button
											key={schedule.id}
											variant={
												selectedScheduleId === schedule.id
													? 'secondary'
													: 'outline'
											}
											className={cn(
												'w-full justify-between h-auto py-2 px-4 mb-2',
												maxParticipants - schedule.currentParticipants <=
													0 && 'bg-secondary/40',
											)}
											onClick={() => setSelectedScheduleId(schedule.id)}
											disabled={
												maxParticipants - schedule.currentParticipants <= 0
											}
										>
											<span className="text-base">
												{formatTime(schedule.startAt)} ~{' '}
												{formatTime(schedule.endAt)}
											</span>
											<span
												className={cn(
													'text-sm',
													maxParticipants -
														schedule.currentParticipants <=
														0
														? 'text-destructive font-semibold'
														: selectedScheduleId === schedule.id
															? 'text-secondary-foreground'
															: 'text-muted-foreground',
												)}
											>
												{schedule.currentParticipants} / {maxParticipants}명
											</span>
										</Button>
									))}
								</div>
							) : (
								<p className="text-sm text-muted-foreground py-2">
									현재 열린 클래스가 없어요.
								</p>
							)}
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
						{!selectedScheduleId && (
							<p className="text-sm text-muted-foreground mb-2">
								먼저 시간대를 선택해주세요.
							</p>
						)}
						<div className="flex items-center justify-between border rounded-md p-2">
							<Button
								variant="ghost"
								size="icon"
								onClick={() => handleHeadcountChange(-1)}
								disabled={!selectedScheduleId || headcount <= 1}
							>
								-
							</Button>
							<Input
								type="number"
								value={headcount}
								readOnly
								disabled={!selectedScheduleId}
								className="w-16 text-center text-lg font-semibold border-none focus-visible:ring-0"
							/>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => handleHeadcountChange(1)}
								disabled={
									!selectedScheduleId ||
									effectiveHeadcountMax <= 0 ||
									headcount >= effectiveHeadcountMax
								}
							>
								+
							</Button>
						</div>
					</div>

					<div className="text-right mb-4">
						{discountRate > 0 && (
							<div className="flex items-center justify-end gap-2 text-muted-foreground line-through text-sm">
								<span>{(price * headcount).toLocaleString()}원</span>
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
						disabled={
							!selectedScheduleId ||
							isOwnedByCurrentUser ||
							(selectedScheduleRemainingSlots !== null &&
								selectedScheduleRemainingSlots <= 0)
						}
					>
						클래스 신청
					</Button>
				</Card>
			</div>
		</div>
	);
};
