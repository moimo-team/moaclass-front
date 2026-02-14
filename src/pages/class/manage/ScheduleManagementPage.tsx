import { useState } from 'react';

import {
	isSameDay,
	addMonths,
	subMonths,
	startOfMonth,
	endOfMonth,
	eachDayOfInterval,
	isWeekend as isDateWeekend,
} from 'date-fns';
import { ArrowLeft, Plus } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

import LoadingSpinner from '@/components/common/LoadingSpinner';
import { ScheduleCalendar } from '@/components/features/class-manage/schedule/ScheduleCalendar';
import { ScheduleSidebar } from '@/components/features/class-manage/schedule/ScheduleSidebar';
import { CreateScheduleModal } from '@/components/features/modal/create/CreateScheduleModal';
import { Button } from '@/components/ui/button';
import { useScheduleQuery } from '@/hooks/useScheduleQuery';

export default function ScheduleManagementPage() {
	const { lessonId } = useParams();
	const navigate = useNavigate();

	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [selectedDates, setSelectedDates] = useState<Date[]>([]);
	const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

	const { data, isLoading, isError } = useScheduleQuery(Number(lessonId));

	const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
	const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
	const handleToday = () => setCurrentMonth(new Date());

	const handleDateClick = (date: Date) => {
		setSelectedDates((prev) => {
			const isAlreadySelected = prev.some((d) => isSameDay(d, date));
			if (isAlreadySelected) {
				return prev.filter((d) => !isSameDay(d, date));
			}
			return [...prev, date];
		});
	};

	const toggleDatesByType = (isWeekend: boolean) => {
		const monthStart = startOfMonth(currentMonth);
		const monthEnd = endOfMonth(currentMonth);
		const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

		const targetDates = daysInMonth.filter((date) => isDateWeekend(date) === isWeekend);

		setSelectedDates((prev) => {
			const allTargetsSelected = targetDates.every((target) =>
				prev.some((p) => isSameDay(p, target)),
			);

			if (allTargetsSelected) {
				return prev.filter((p) => !targetDates.some((target) => isSameDay(p, target)));
			} else {
				const otherDates = prev.filter(
					(p) => !targetDates.some((target) => isSameDay(p, target)),
				);
				return [...otherDates, ...targetDates];
			}
		});
	};

	if (isLoading) return <LoadingSpinner />;

	if (isError) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen gap-4">
				<p className="text-red-500 font-medium">일정을 불러올 수 없습니다.</p>
				<Button onClick={() => navigate(-1)} variant="outline">
					돌아가기
				</Button>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-8 px-4 max-w-7xl">
			<div className="flex items-center justify-between mb-8">
				<div className="flex items-center gap-4">
					<button
						onClick={() => navigate(-1)}
						className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
					>
						<ArrowLeft className="w-5 h-5 text-gray-600" />
					</button>
					<div>
						<h1 className="text-2xl font-bold text-gray-900 tracking-tight">
							일정 및 예약 관리
						</h1>
						<p className="text-sm text-gray-500 mt-1 font-medium">
							클래스 {lessonId}의 일정을 관리합니다.
						</p>
					</div>
				</div>

				<div className="flex items-center gap-4">
					{selectedDates.length > 0 && (
						<p className="text-sm font-bold text-primary animate-in fade-in slide-in-from-right-2">
							{selectedDates.length}개 날짜 선택됨
						</p>
					)}
					<Button
						onClick={() => setIsRegisterModalOpen(true)}
						className="font-bold gap-2 rounded-xl h-11 px-6 shadow-sm hover:shadow transition-all"
					>
						<Plus className="w-5 h-5" />
						일정 등록
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
				<div className="lg:col-span-8 overflow-hidden">
					<ScheduleCalendar
						currentMonth={currentMonth}
						onPrevMonth={handlePrevMonth}
						onNextMonth={handleNextMonth}
						onToday={handleToday}
						onSelectWeekdays={() => toggleDatesByType(false)}
						onSelectWeekends={() => toggleDatesByType(true)}
						onDeselectAll={() => setSelectedDates([])}
						schedulesByDate={data?.byDate || {}}
						selectedDates={selectedDates}
						onDateClick={handleDateClick}
					/>
				</div>

				<div className="lg:col-span-4 bg-white rounded-2xl border shadow-sm p-6 sticky top-8">
					<ScheduleSidebar
						lessonId={Number(lessonId)}
						selectedDates={selectedDates}
						schedulesByDate={data?.byDate || {}}
					/>
				</div>
			</div>

			<CreateScheduleModal
				isOpen={isRegisterModalOpen}
				onClose={() => setIsRegisterModalOpen(false)}
				lessonId={Number(lessonId)}
				selectedDates={selectedDates}
			/>
		</div>
	);
}
