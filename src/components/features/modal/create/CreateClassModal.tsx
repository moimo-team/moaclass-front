import { useEffect, useRef } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { FormModal } from '@/components/features/modal/components/FormModal';
import { useCreateLessonMutation, useUpdateLessonMutation } from '@/hooks/useLessonMutations';
import { useLessonQuery } from '@/hooks/useLessonQuery';

import { classSchema } from './classSchema';
import { BasicInfoSection } from './sections/BasicInfoSection';
import { CategorySection } from './sections/CategorySection';
import { CurriculumSection } from './sections/CurriculumSection';
import { fetchAndSetDuplicateImage, ImageSection } from './sections/ImageSection';
import { LocationSection } from './sections/LocationSection';
import { PricingSection } from './sections/PricingSection';

import type { ClassFormValues } from './classSchema';

// 임시저장 시 백엔드 필수 체크를 통과하기 위한 투명 1x1 픽셀 GIF
const TRANSPARENT_PIXEL =
	'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

const DEFAULT_VALUES: ClassFormValues = {
	title: '',
	description: '',
	curriculum: '',
	classCategoryId: 0,
	subCategoryIds: [],
	level: 'BEGINNER',
	duration: 60,
	price: 0,
	discountRate: 0,
	maxParticipants: 10,
	regionId: 0,
	address: '',
	latitude: 0,
	longitude: 0,
	detailAddress: '',
	directionsText: '',
	reservationLeadDays: 1,
	representativeImageFile: undefined,
	additionalImageFiles: [],
};

interface CreateClassModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	classId?: number;
	isDuplicating?: boolean;
	// DRAFT 상태 클래스를 이어서 작성할 때 true - 생성 모드로 동작
	isDraft?: boolean;
}

function CreateClassModal({
	open,
	onOpenChange,
	classId,
	isDuplicating = false,
	isDraft = false,
}: CreateClassModalProps) {
	const prevCategoryIdRef = useRef<number | null>(null);

	const { mutateAsync: createLessonMutation } = useCreateLessonMutation();
	const { mutateAsync: updateLessonMutation } = useUpdateLessonMutation();

	// 수정 또는 복제 모드일 때 기존 레슨 데이터 불러오기
	const { data: existingLesson, isLoading: isLoadingLesson } = useLessonQuery(classId || 0, {
		enabled: !!classId && open,
	});

	const methods = useForm<ClassFormValues>({
		resolver: zodResolver(classSchema),
		mode: 'onChange',
		defaultValues: DEFAULT_VALUES,
	});

	const {
		handleSubmit,
		setValue,
		reset,
		getValues,
		watch,
		formState: { isValid, isSubmitting },
	} = methods;

	const selectedCategoryId = watch('classCategoryId');

	// 모달 열릴 때 / 기존 데이터 로드 완료 시 폼 초기화
	useEffect(() => {
		if (!open) return;

		if (classId) {
			if (isLoadingLesson) return;

			if (existingLesson) {
				const subCategoryIds =
					existingLesson.subClassCategories?.map((sub) => sub.id) || [];

				// 복제 모드일 경우 제목 뒤에 번호 추가 ((1), (2) 등)
				let title = existingLesson.title;
				if (isDuplicating) {
					const match = title.match(/\((\d+)\)$/);
					if (match) {
						const num = parseInt(match[1]) + 1;
						title = title.replace(/\(\d+\)$/, `(${num})`);
					} else {
						title = `${title} (1)`;
					}
				}

				reset({
					title,
					description: existingLesson.description,
					curriculum: existingLesson.curriculum,
					classCategoryId: existingLesson.lessonCategoryId,
					subCategoryIds,
					level: existingLesson.level,
					duration: existingLesson.durationMin,
					price: existingLesson.price,
					discountRate: existingLesson.discountRate,
					maxParticipants: existingLesson.maxParticipants || 10,
					regionId: existingLesson.regionId,
					address: existingLesson.address,
					latitude: existingLesson.latitude,
					longitude: existingLesson.longitude,
					detailAddress: existingLesson.detailAddress,
					directionsText: existingLesson.directionsText,
					reservationLeadDays: existingLesson.reservationLeadDays,
				});

				// CORS로 인해 외부 이미지 직접 fetch가 차단될 수 있으므로 try/catch로 처리
				// 실패 시 투명 1x1 픽셀로 대체하여 백엔드 필수 이미지 체크 통과
				if (isDuplicating && existingLesson.representativeImage) {
					fetchAndSetDuplicateImage(existingLesson.representativeImage, setValue);
				}

				prevCategoryIdRef.current = existingLesson.lessonCategoryId;
			}
		} else {
			// 생성 모드 - 폼 초기화
			reset(DEFAULT_VALUES);
			prevCategoryIdRef.current = 0;
		}
	}, [open, classId, isLoadingLesson, existingLesson, isDuplicating, isDraft, reset, setValue]);

	// 대분류 카테고리가 실제로 변경되었을 때만 소분류 초기화
	useEffect(() => {
		if (
			selectedCategoryId &&
			prevCategoryIdRef.current !== null &&
			prevCategoryIdRef.current !== selectedCategoryId
		) {
			setValue('subCategoryIds', []);
		}
		prevCategoryIdRef.current = selectedCategoryId;
	}, [selectedCategoryId, setValue]);

	const handleFinalSubmit = async (
		data: Partial<ClassFormValues>,
		status: 'DRAFT' | 'ACTIVE',
	) => {
		try {
			const formData = new FormData();
			// 백엔드 DTO가 DRAFT 상태에서도 모든 필드를 필수(Required)로 요구하므로,
			// 임시저장 시 빈 값인 필드들은 최소한의 더미 데이터로 채워줍니다.
			const isDraftStatus = status === 'DRAFT';

			formData.append('title', data.title || (isDraftStatus ? '임시 클래스명' : ''));
			formData.append(
				'description',
				data.description || (isDraftStatus ? '임시 클래스 소개' : ''),
			);
			formData.append(
				'curriculum',
				data.curriculum ||
					(isDraftStatus
						? '임시 커리큘럼 내용입니다. (40자 이상 성실히 작성된 내용)'
						: ''),
			);
			formData.append(
				'lessonCategoryId',
				(data.classCategoryId || (isDraftStatus ? 1 : 0)).toString(),
			);

			// subCategoryIds는 최소 1개의 요소가 필요함 (ArrayMinSize(1))
			const subIds =
				data.subCategoryIds && data.subCategoryIds.length > 0
					? data.subCategoryIds
					: isDraftStatus
						? [1]
						: [];
			formData.append('subCategoryIds', JSON.stringify(subIds));

			formData.append('level', data.level || 'BEGINNER');
			formData.append('durationMin', (data.duration || 60).toString());
			formData.append('price', (data.price || 0).toString());
			formData.append('discountRate', (data.discountRate || 0).toString());
			formData.append(
				'discountedPrice',
				Math.round((data.price || 0) * (1 - (data.discountRate || 0) / 100)).toString(),
			);
			formData.append('maxParticipants', (data.maxParticipants || 10).toString());
			formData.append('regionId', (data.regionId || (isDraftStatus ? 1 : 0)).toString());
			formData.append(
				'address',
				data.address || (isDraftStatus ? '서울특별시 마포구 양화로 45' : ''),
			);
			formData.append(
				'detailAddress',
				data.detailAddress || (isDraftStatus ? '임시 상세주소' : ''),
			);
			formData.append(
				'directionsText',
				data.directionsText || (isDraftStatus ? '임시 찾아오는 길' : ''),
			);
			formData.append('reservationLeadDays', (data.reservationLeadDays || 1).toString());
			formData.append('status', status);

			// 이미지 처리
			const currentRemoveSequences = data.removeSequences || [];

			// 1. 대표 이미지 (image1)
			if (data.representativeImageFile) {
				formData.append('image1', data.representativeImageFile);
			} else if (isDraftStatus && !existingLesson?.representativeImage) {
				// 임시저장인데 기존 이미지가 없고 새로 추가도 안한 경우
				const res = await fetch(TRANSPARENT_PIXEL);
				const blob = await res.blob();
				const dummyFile = new File([blob], 'draft_placeholder.png', { type: 'image/png' });
				formData.append('image1', dummyFile);
			}

			// 2. 삭제된 시퀀스 전송
			currentRemoveSequences.forEach((seq) => {
				formData.append('removeSequences', seq.toString());
			});

			// 3. 추가 이미지 (image2~image6)
			if (data.additionalImageFiles && data.additionalImageFiles.length > 0) {
				// 현재 사용 중인 슬롯들 (기존 이미지 중 삭제되지 않은 것들)
				const usedSlots = new Set<number>();
				if (existingLesson?.images) {
					existingLesson.images.forEach((img) => {
						const slot = img.sequence + 1; // sequence 1 -> slot 2
						if (!currentRemoveSequences.includes(slot)) {
							usedSlots.add(slot);
						}
					});
				}

				// 사용 가능한 슬롯들 (2~6 중 usedSlots에 없는 것들)
				const availableSlots = [2, 3, 4, 5, 6].filter((s) => !usedSlots.has(s));

				data.additionalImageFiles.forEach((file, i) => {
					const slot = availableSlots[i];
					if (slot) {
						formData.append(`image${slot}`, file);
					}
				});
			}

			// DRAFT 상태를 이어서 작성하는 경우도 새 클래스 생성으로 처리 (updateLesson 사용 금지)
			if (classId && !isDuplicating && !isDraft) {
				await updateLessonMutation({ lessonId: classId, formData });
				toast.success('클래스 수정 완료', {
					description: '클래스가 성공적으로 수정되었습니다!',
				});
			} else {
				await createLessonMutation(formData);
				toast.success(status === 'DRAFT' ? '임시저장 완료' : '클래스 생성 완료', {
					description:
						status === 'DRAFT'
							? '클래스가 임시저장되었습니다.'
							: '클래스가 성공적으로 생성되었습니다!',
				});
			}

			onOpenChange(false);
		} catch {
			toast.error('오류 발생', {
				description: '클래스 처리 중 오류가 발생했습니다.',
			});
		}
	};

	const onSubmit = (data: ClassFormValues) => handleFinalSubmit(data, 'ACTIVE');

	const handleDraftSubmit = () => {
		const data = getValues();
		handleFinalSubmit(data, 'DRAFT');
	};

	// DRAFT 상태에서 불러온 경우도 생성 모드로 처리
	const isCreationMode = !classId || isDuplicating || isDraft;

	// 카테고리 선택 전까지는 소분류 로딩 중이므로 폼 준비 상태 체크
	const isFormReady = open && (!classId || !isLoadingLesson);

	return (
		<FormProvider {...methods}>
			<FormModal
				isOpen={open}
				onClose={() => onOpenChange(false)}
				onSubmit={handleSubmit(onSubmit)}
				onDraft={isCreationMode ? handleDraftSubmit : undefined}
				title={!isCreationMode ? '클래스 정보 수정하기' : '새 클래스 만들기'}
				submitButtonText={isCreationMode ? '클래스 생성' : '수정하기'}
				draftButtonText={isCreationMode ? '임시저장' : undefined}
				isSubmitDisabled={isCreationMode ? !isValid : false}
				isLoading={!isFormReady || isSubmitting}
				containerClassName="max-w-2xl"
			>
				<BasicInfoSection />
				<CategorySection />
				<ImageSection
					initialPreviewImage={
						isDuplicating || isDraft ? existingLesson?.representativeImage : null
					}
					initialAdditionalImages={existingLesson?.images}
				/>
				<CurriculumSection />
				<PricingSection />
				<LocationSection />
			</FormModal>
		</FormProvider>
	);
}

export default CreateClassModal;
