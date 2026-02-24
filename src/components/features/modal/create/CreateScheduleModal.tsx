import { useEffect, useState } from 'react';

import { format, eachDayOfInterval } from 'date-fns';
import { Plus, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { Controller, useForm, useFieldArray, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import { TimePicker } from '@/components/common/TimePicker';
import { FormInput } from '@/components/features/modal/components/FormInput';
import { FormModal } from '@/components/features/modal/components/FormModal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLessonQuery } from '@/hooks/useLessonQuery';
import { useCreateSchedulesMutation } from '@/hooks/useScheduleMutations';
import {
	combineDateAndTime,
	isEndTimeAfterStartTime,
	addMinutesToTime,
} from '@/utils/scheduleHelpers';

interface CreateScheduleModalProps {
	isOpen: boolean;
	onClose: () => void;
	lessonId: number;
	selectedDates: Date[];
}

export const CreateScheduleModal = ({
	isOpen,
	onClose,
	lessonId,
	selectedDates,
}: CreateScheduleModalProps) => {
	const { mutate: createSchedules, isPending } = useCreateSchedulesMutation(lessonId);
	const [activeTab, setActiveTab] = useState('single');

	useEffect(() => {
		if (isOpen) {
			setActiveTab(selectedDates.length > 0 ? 'single' : 'recurring');
		}
	}, [isOpen, selectedDates.length]);

	const { data: lesson } = useLessonQuery(lessonId);
	const durationMin = lesson?.durationMin ?? 60;

	const singleForm = useForm({
		defaultValues: {
			timeSlots: [{ startTime: '09:00', endTime: '10:00' }],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: singleForm.control,
		name: 'timeSlots',
	});

	// 개별 등록: 시작 시간 변경 시 종료 시간 자동 계산
	const watchedTimeSlots = useWatch({
		control: singleForm.control,
		name: 'timeSlots',
	});

	useEffect(() => {
		if (!watchedTimeSlots) return;

		watchedTimeSlots.forEach((slot, index) => {
			if (slot?.startTime) {
				const calculatedEndTime = addMinutesToTime(slot.startTime, durationMin);
				if (slot.endTime !== calculatedEndTime) {
					singleForm.setValue(`timeSlots.${index}.endTime`, calculatedEndTime, {
						shouldDirty: true,
					});
				}
			}
		});
	}, [watchedTimeSlots, durationMin, singleForm]);

	const onSingleSubmit = (data: { timeSlots: { startTime: string; endTime: string }[] }) => {
		if (selectedDates.length === 0) {
			toast.error('날짜를 하나 이상 선택해 주세요.');
			return;
		}

		try {
			const schedules = selectedDates.flatMap((date) =>
				data.timeSlots.map((slot) => {
					if (!isEndTimeAfterStartTime(slot.startTime, slot.endTime)) {
						throw new Error(`종료 시간은 시작 시간보다 늦어야 합니다.`);
					}
					return {
						startAt: combineDateAndTime(date, slot.startTime),
						endAt: combineDateAndTime(date, slot.endTime),
					};
				}),
			);

			createSchedules(schedules, { onSuccess: onClose });
		} catch (e) {
			if (e instanceof Error) {
				toast.error(e.message);
			} else {
				toast.error('알 수 없는 오류가 발생했습니다.');
			}
		}
	};

	interface RecurringFormData {
		startDate: string;
		endDate: string;
		startTime: string;
		endTime: string;
	}

	const recurringForm = useForm<RecurringFormData>({
		defaultValues: {
			startDate: format(new Date(), 'yyyy-MM-dd'),
			endDate: format(new Date(), 'yyyy-MM-dd'),
			startTime: '09:00',
			endTime: '10:00',
		},
	});

	// 반복 등록: 시작 시간 변경 시 종료 시간 자동 계산
	const watchedRecurringStartTime = recurringForm.watch('startTime');
	useEffect(() => {
		if (watchedRecurringStartTime) {
			const calculatedEndTime = addMinutesToTime(watchedRecurringStartTime, durationMin);
			recurringForm.setValue('endTime', calculatedEndTime);
		}
	}, [watchedRecurringStartTime, durationMin, recurringForm]);

	const onRecurringSubmit = (data: RecurringFormData) => {
		const start = new Date(data.startDate);
		const end = new Date(data.endDate);

		if (start > end) {
			toast.error('시작일이 종료일보다 늦을 수 없습니다.');
			return;
		}

		if (!isEndTimeAfterStartTime(data.startTime, data.endTime)) {
			toast.error('종료 시간이 시작 시간보다 늦어야 합니다. 시간을 다시 확인해 주세요.');
			return;
		}

		const dates = eachDayOfInterval({ start, end });
		const schedules = dates.map((date) => ({
			startAt: combineDateAndTime(date, data.startTime),
			endAt: combineDateAndTime(date, data.endTime),
		}));

		createSchedules(schedules, { onSuccess: onClose });
	};

	return (
		<FormModal
			isOpen={isOpen}
			onClose={onClose}
			title="새 일정 등록"
			showFooter={false}
			containerClassName="max-w-md"
		>
			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
				<TabsList
					className={`grid p-1 bg-gray-100/50 rounded-xl mb-6 ${selectedDates.length > 0 ? 'grid-cols-2' : 'grid-cols-1'}`}
				>
					{selectedDates.length > 0 && (
						<TabsTrigger value="single" className="rounded-lg font-bold py-2.5">
							개별 등록
						</TabsTrigger>
					)}
					<TabsTrigger value="recurring" className="rounded-lg font-bold py-2.5">
						반복 등록
					</TabsTrigger>
				</TabsList>

				<div className="space-y-6">
					<TabsContent value="single" className="mt-0 space-y-6 outline-none">
						<div className="space-y-2">
							<Label className="text-sm font-bold text-gray-700">
								선택된 날짜 ({selectedDates.length})
							</Label>
							<div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-xl border border-gray-100 max-h-32 overflow-y-auto">
								{selectedDates.length > 0 ? (
									selectedDates.map((date) => (
										<span
											key={date.toISOString()}
											className="px-2.5 py-1 bg-white border border-gray-200 rounded-md text-xs font-bold text-gray-600 shadow-sm"
										>
											{format(date, 'MM/dd')}
										</span>
									))
								) : (
									<p className="text-xs text-gray-400 font-bold">
										캘린더에서 날짜를 먼저 선택해 주세요.
									</p>
								)}
							</div>
						</div>

						<form
							onSubmit={singleForm.handleSubmit(onSingleSubmit)}
							className="space-y-6"
						>
							{selectedDates.length > 0 && (
								<div className="space-y-4 animate-in fade-in duration-300">
									<div className="flex justify-between items-center">
										<Label className="text-sm font-bold text-gray-700">
											시간 설정
										</Label>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											onClick={() => {
												const lastSlot =
													fields[fields.length - 1] ||
													watchedTimeSlots[0];
												const startTime = lastSlot?.startTime || '09:00';
												const endTime = addMinutesToTime(
													startTime,
													durationMin,
												);
												append({ startTime, endTime });
											}}
											className="h-8 text-primary font-bold gap-1 hover:bg-primary/5 px-2"
										>
											<Plus className="w-4 h-4" /> 슬롯 추가
										</Button>
									</div>

									<div className="space-y-3">
										{fields.map((field, index) => (
											<div
												key={field.id}
												className="flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200"
											>
												<Controller
													name={`timeSlots.${index}.startTime`}
													control={singleForm.control}
													render={({ field, fieldState }) => (
														<TimePicker
															value={field.value}
															onChange={field.onChange}
															error={fieldState.error?.message}
														/>
													)}
												/>
												<span className="text-gray-400 font-bold self-center">
													~
												</span>
												<Controller
													name={`timeSlots.${index}.endTime`}
													control={singleForm.control}
													render={({ field, fieldState }) => (
														<TimePicker
															value={field.value}
															onChange={field.onChange}
															error={fieldState.error?.message}
														/>
													)}
												/>
												{fields.length > 1 && (
													<Button
														type="button"
														variant="ghost"
														size="icon"
														onClick={() => remove(index)}
														className="h-12 w-12 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg shrink-0 mt-2 transition-colors"
													>
														<Trash2 className="w-4 h-4" />
													</Button>
												)}
											</div>
										))}
									</div>
								</div>
							)}

							<Button
								type="submit"
								disabled={isPending || selectedDates.length === 0}
								className="w-full h-14 rounded-xl font-bold text-lg shadow-md transition-all mt-4"
							>
								{isPending ? '등록 중...' : `${selectedDates.length}개 날짜에 등록`}
							</Button>
						</form>
					</TabsContent>

					<TabsContent value="recurring" className="mt-0 space-y-6 outline-none">
						<form
							onSubmit={recurringForm.handleSubmit(onRecurringSubmit)}
							className="space-y-6"
						>
							<div className="grid grid-cols-2 gap-4">
								<FormInput
									id="startDate"
									label="시작일"
									type="date"
									icon={<CalendarIcon className="w-4 h-4 text-primary" />}
									register={recurringForm.register('startDate')}
								/>
								<FormInput
									id="endDate"
									label="종료일"
									type="date"
									icon={<CalendarIcon className="w-4 h-4 text-primary" />}
									register={recurringForm.register('endDate')}
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<Controller
									name="startTime"
									control={recurringForm.control}
									render={({ field, fieldState }) => (
										<TimePicker
											label="시작 시간"
											value={field.value}
											onChange={field.onChange}
											error={fieldState.error?.message}
										/>
									)}
								/>
								<Controller
									name="endTime"
									control={recurringForm.control}
									render={({ field, fieldState }) => (
										<TimePicker
											label="종료 시간"
											value={field.value}
											onChange={field.onChange}
											error={fieldState.error?.message}
										/>
									)}
								/>
							</div>

							<div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
								<CalendarIcon className="w-5 h-5 text-amber-500 shrink-0" />
								<p className="text-xs text-amber-700 leading-normal font-bold">
									선택한 기간 내의 모든 날짜에 동일한 시간으로 일정이 생성됩니다.
								</p>
							</div>

							<Button
								type="submit"
								disabled={isPending}
								className="w-full h-14 rounded-xl font-bold text-lg shadow-md transition-all mt-2"
							>
								{isPending ? '등록 중...' : '일정 일괄 등록'}
							</Button>
						</form>
					</TabsContent>
				</div>
			</Tabs>
		</FormModal>
	);
};
