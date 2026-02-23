import { useEffect, useRef, useState } from 'react';

import DateTimePicker from '@components/common/DateTimePicker';
import FormField from '@components/common/FormField';
import LoadingSpinner from '@components/common/LoadingSpinner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import * as z from 'zod';

import type { MyMeetingsResponse } from '@/api/me.api';
import KakaoMapSearch from '@/components/features/map/kakaoMaps/KakaoMapSearch';
import { FormImageUpload } from '@/components/features/modal/components/FormImageUpload';
import { FormInput } from '@/components/features/modal/components/FormInput';
import { FormModal } from '@/components/features/modal/components/FormModal';
import { FormTextarea } from '@/components/features/modal/components/FormTextarea';
import { Slider } from '@/components/ui/slider';
import { useInterestQuery } from '@/hooks/useInterestQuery';
import { useCreateMeetingMutation, useUpdateMeetingMutation } from '@/hooks/useMeetingMutations';
import { useMeetingQuery } from '@/hooks/useMeetingQuery';
import type { PlaceInfo } from '@/models/kakao-maps.model';
import type { Meeting, MeetingDetail } from '@/models/meeting.model';
import { combineDateAndTime, parseToTimeComponents } from '@/utils/dateFormat';

// Zod 스키마 정의
const meetingSchema = z.object({
	title: z.string().min(1, '모임명을 입력해주세요').max(100, '100자 이내로 입력해주세요'),
	description: z
		.string()
		.min(1, '모임 소개를 입력해주세요')
		.max(4000, '4000자 이내로 입력해주세요'),
	interestId: z.number({ message: '관심사를 선택해주세요' }),
	maxParticipants: z.number(),
	meetingDate: z.date({ message: '날짜를 선택해주세요' }),
	meetingHour: z.string(),
	meetingMinute: z.string(),
	meetingPeriod: z.enum(['AM', 'PM']),
	address: z.string().min(1, '모임 장소를 입력해주세요'),
	meetingImageFile: z.instanceof(File).optional(),
});

type MeetingFormValues = z.infer<typeof meetingSchema>;

interface CreateMeetingModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	meeting?: Meeting | MyMeetingsResponse | MeetingDetail;
}

function CreateMeetingModal({ open, onOpenChange, meeting }: CreateMeetingModalProps) {
	const navigate = useNavigate();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [previewImage, setPreviewImage] = useState<string | null>(null);
	const [isFormReady, setIsFormReady] = useState(false);

	const { data: meetingDetail, isLoading: isMeetingLoading } = useMeetingQuery(
		open && meeting
			? 'meetingId' in meeting
				? meeting.meetingId
				: (meeting as { id: number }).id
			: undefined,
	);

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		reset,
		formState: { errors, isValid },
	} = useForm<MeetingFormValues>({
		resolver: zodResolver(meetingSchema),
		mode: 'onChange',
		defaultValues: {
			title: '',
			description: '',
			interestId: undefined as any,
			maxParticipants: 15,
			meetingDate: undefined,
			meetingHour: '3',
			meetingMinute: '00',
			meetingPeriod: 'PM',
			address: '',
			meetingImageFile: undefined,
		},
	});

	const createMeetingMutation = useCreateMeetingMutation();
	const updateMeetingMutation = useUpdateMeetingMutation();

	// 폼 데이터 감시
	const interestId = watch('interestId');
	const maxParticipants = watch('maxParticipants');
	const meetingDate = watch('meetingDate');
	const meetingHour = watch('meetingHour');
	const meetingMinute = watch('meetingMinute');
	const meetingPeriod = watch('meetingPeriod');

	// 수정 모드일 때 데이터 로드
	useEffect(() => {
		if (open) {
			if (meeting) {
				// 수정 모드: 데이터가 로드되면 폼 초기화
				if (meetingDetail) {
					// 시간 파싱
					let hourStr = '12';
					let minuteStr = '00';
					let periodVal: 'AM' | 'PM' = 'PM';

					if (meetingDetail.meetingDate) {
						const timeComponents = parseToTimeComponents(meetingDetail.meetingDate);
						hourStr = timeComponents.hour;
						minuteStr = timeComponents.minute;
						periodVal = timeComponents.period;
					}

					reset({
						title: meetingDetail.title,
						description: meetingDetail.description || '',
						interestId: meetingDetail.interestId,
						maxParticipants: meetingDetail.maxParticipants,
						meetingDate: meetingDetail.meetingDate
							? new Date(meetingDetail.meetingDate)
							: undefined,
						meetingHour: hourStr,
						meetingMinute: minuteStr,
						meetingPeriod: periodVal,
						address: meetingDetail.location.address,
					});
					setPreviewImage(meetingDetail.meetingImage || null);
					setIsFormReady(true);
				} else {
					// 데이터 로딩 중
					setIsFormReady(false);
				}
			} else {
				// 새 모임 생성: 즉시 준비 완료
				reset({
					title: '',
					description: '',
					interestId: undefined as any,
					maxParticipants: 15,
					meetingDate: undefined,
					meetingHour: '12',
					meetingMinute: '00',
					meetingPeriod: 'PM',
					address: '',
					meetingImageFile: undefined,
				});
				setPreviewImage(null);
				setIsFormReady(true);
			}
		} else {
			setIsFormReady(false);
		}
	}, [open, meeting, meetingDetail, reset]);

	// 이미지 변경 핸들러 (FormImageUpload 컴포넌트에서 검증 처리)
	const handleImageChange = (dataUrl: string, file: File) => {
		setPreviewImage(dataUrl);
		setValue('meetingImageFile', file, { shouldValidate: true });
	};

	// 장소 선택 핸들러
	const handlePlaceSelect = (place: PlaceInfo) => {
		setValue('address', place.roadAddress || place.address, { shouldValidate: true });
	};

	const onSubmit = async (data: MeetingFormValues) => {
		const confirmed = window.confirm(
			meeting
				? '모임을 수정하시겠습니까?'
				: '모임을 생성하시겠습니까?\n신청 내용은 마이페이지에서 언제든지 수정 가능합니다.',
		);

		if (!confirmed) {
			return;
		}

		try {
			// 날짜와 시간 결합 (유틸 함수 사용)
			const formattedDate = combineDateAndTime(
				data.meetingDate,
				data.meetingHour,
				data.meetingMinute,
				data.meetingPeriod,
			);

			// FormData 생성 (사용자 가이드 명세 준수)
			const formData = new FormData();
			formData.append('title', data.title);
			formData.append('description', data.description);
			formData.append('categoryId', String(data.interestId));
			formData.append('maxParticipants', String(data.maxParticipants));
			formData.append('meetingDate', formattedDate);
			formData.append('address', data.address);

			if (data.meetingImageFile) {
				formData.append('meetingImage', data.meetingImageFile);
			}

			if (meeting) {
				// meetingId 추출
				const mid =
					'meetingId' in meeting ? meeting.meetingId : (meeting as { id: number }).id;

				await updateMeetingMutation.mutateAsync({
					id: mid,
					data: formData,
				});
				toast.success('모임이 수정되었습니다!');
				onOpenChange(false);
			} else {
				await createMeetingMutation.mutateAsync(formData);
				toast.success('모임이 생성되었습니다!', {
					description: '마이페이지 - 내 모임에서 확인할 수 있습니다!',
				});
				onOpenChange(false);
				navigate('/');
			}
		} catch (error: unknown) {
			console.error('Submission error:', error);
			const err = error as {
				response?: { data?: { message?: string | string[]; error?: string | string[] } };
			};
			const serverData = err.response?.data;
			const serverMessage = serverData?.message || serverData?.error;
			const displayMessage = Array.isArray(serverMessage)
				? serverMessage.join('\n')
				: serverMessage;

			toast.error('모임 생성에 실패했습니다', {
				description: displayMessage || '입력 정보를 확인해주세요',
			});
		}
	};

	return (
		<FormModal
			isOpen={open}
			onClose={() => onOpenChange(false)}
			onSubmit={handleSubmit(onSubmit)}
			title={meeting ? '모임 정보 수정하기' : '모임 개설하기'}
			submitButtonText={
				meeting
					? updateMeetingMutation.isPending
						? '수정 중...'
						: '수정하기'
					: createMeetingMutation.isPending
						? '개설 중...'
						: '개설하기'
			}
			isSubmitDisabled={
				!isValid || createMeetingMutation.isPending || updateMeetingMutation.isPending
			}
			isLoading={isMeetingLoading || !isFormReady}
			loadingComponent={<LoadingSpinner />}
			containerClassName="max-w-2xl"
		>
			{/* 모임명 */}
			<FormInput
				id="title"
				label="모임명"
				register={register('title')}
				placeholder="표현하고 싶은 모임명을 입력하세요! (100자 이내)"
				maxLength={100}
				currentLength={watch('title')?.length || 0}
				error={errors.title?.message}
			/>

			{/* 모임 소개글 */}
			<FormTextarea
				id="description"
				label="모임 소개글"
				register={register('description')}
				placeholder="모임에 대해 자유롭게 설명해주세요! (4000자 이내)&#10;ex) (필수) 모임의 정확한 위치, 개성적인 특징, 참여자가 가지면 좋은 마인드, 지켜야 할 사항"
				maxLength={4000}
				currentLength={watch('description')?.length || 0}
				error={errors.description?.message}
				className="min-h-[120px]"
			/>

			{/* 관심사 선택 */}
			<FormField label="관심사" description="어떤 주제의 모임인가요?">
				<div className="flex flex-wrap gap-2">
					{useInterestQuery().data?.map((interest) => (
						<button
							key={interest.id}
							type="button"
							onClick={() =>
								setValue('interestId', interest.id, { shouldValidate: true })
							}
							className={`px-4 py-2 rounded-full border text-sm transition-all ${
								interestId === interest.id
									? 'bg-primary text-primary-foreground border-primary'
									: 'bg-background text-foreground hover:border-primary'
							}`}
						>
							{interest.name}
						</button>
					))}
				</div>
				{errors.interestId && (
					<p className="text-xs text-red-500 mt-1">{errors.interestId.message}</p>
				)}
			</FormField>

			{/* 모임 대표 사진 */}
			<FormImageUpload
				ref={fileInputRef}
				previewImage={previewImage}
				onImageChange={handleImageChange}
				shape="square"
				label="모임 대표 사진"
				description="모임을 대표할 사진을 선택해주세요 (4.5MB 이하 영문 파일명만 가능)"
			/>

			{/* 모임 날짜 및 시간 */}
			<FormField
				label="모임 날짜 및 시간"
				description="모임이 진행될 날짜와 시간을 선택해주세요"
			>
				<DateTimePicker
					date={meetingDate}
					hour={meetingHour}
					minute={meetingMinute}
					period={meetingPeriod}
					onDateChange={(date) =>
						setValue('meetingDate', date as any, { shouldValidate: true })
					}
					onHourChange={(hour) => setValue('meetingHour', hour)}
					onMinuteChange={(minute) => setValue('meetingMinute', minute)}
					onPeriodChange={(period) => setValue('meetingPeriod', period)}
				/>
				{errors.meetingDate && (
					<p className="text-xs text-red-500 mt-1">{errors.meetingDate.message}</p>
				)}
			</FormField>

			{/* 모임 장소 */}
			<FormField label="모임 장소" description="카카오맵에서 장소를 검색하여 선택해주세요">
				<KakaoMapSearch onPlaceSelect={handlePlaceSelect} defaultValue={watch('address')} />
				{errors.address && (
					<p className="text-xs text-red-500 mt-1">{errors.address.message}</p>
				)}
			</FormField>

			{/* 최대 인원수 */}
			<FormField
				label="최대 인원수"
				description="수용할 수 있는 인원수 만큼만 받는게 중요해요!"
			>
				<div className="space-y-4">
					<Slider
						value={[maxParticipants]}
						onValueChange={(value) =>
							setValue('maxParticipants', value[0], { shouldValidate: true })
						}
						max={50}
						min={2}
						step={1}
						className="w-full"
					/>
					<p className="text-lg font-semibold text-foreground">{maxParticipants}명</p>
				</div>
				{errors.maxParticipants && (
					<p className="text-xs text-red-500 mt-1">{errors.maxParticipants.message}</p>
				)}
			</FormField>
		</FormModal>
	);
}

export default CreateMeetingModal;
