'use client';

import React, { useCallback, useRef } from 'react';
import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller, useWatch, type Control } from 'react-hook-form';
import { z } from 'zod';

import LoadingSpinner from '@/components/common/LoadingSpinner';
import StarRating from '@/components/common/StarRating';
import AlertNotification from '@/components/features/modal/AlertNotification';
import { FormImageUpload } from '@/components/features/modal/components/FormImageUpload';
import { FormModal } from '@/components/features/modal/components/FormModal';
import { Textarea } from '@/components/ui/textarea';
import { useMyReviewQuery } from '@/hooks/useMyReviewQuery';
import { useReviewMutation, useUpdateReviewMutation } from '@/hooks/useReviewMutations';

/**
 * 리뷰 작성을 위한 Zod 스키마
 */
const reviewSchema = z.object({
	rating: z.number().min(0.5, '별점을 선택해주세요.').max(5),
	content: z
		.string()
		.min(10, '후기는 최소 10자 이상 작성해주세요.')
		.max(5000, '후기는 최대 5,000자까지 작성 가능합니다.'),
	images: z.array(z.string()), // 미리보기용 Data URL
	imageFiles: z.array(z.instanceof(File)), // 실제 전송용 File 객체
});

type ReviewFormData = z.infer<typeof reviewSchema>;

/**
 * 별점 선택 안내 문구 컴포넌트 (성능 최적화를 위해 useWatch 사용)
 */
const RatingText = ({ control }: { control: Control<ReviewFormData> }) => {
	const rating = useWatch({
		control,
		name: 'rating',
	});

	return (
		<p className="text-sm text-gray-400">
			{rating > 0 ? `${rating}점을 주셨네요!` : '선택하세요.'}
		</p>
	);
};

/**
 * 글자 수 카운터 컴포넌트 (성능 최적화를 위해 useWatch 사용)
 */
const CharacterCounter = ({ control }: { control: Control<ReviewFormData> }) => {
	const content = useWatch({
		control,
		name: 'content',
	});

	return (
		<div className="absolute bottom-4 right-4 text-xs text-gray-300">
			{content.length.toLocaleString()} / 5,000
		</div>
	);
};

interface ReviewModalProps {
	/** 모달 오픈 상태 */
	open: boolean;
	/** 모달 오픈 상태 변경 함수 */
	onOpenChange: (open: boolean) => void;
	/** 후기를 작성할 클래스 결제내역 아이디 */
	enrollmentId?: number;
	/** 초기 수정 모드 여부 (이미 리뷰가 존재하는지 여부) */
	isEditMode?: boolean;
}

/**
 * 클래스 수강 완료 후 후기를 작성할 수 있는 모달 컴포넌트입니다.
 * 별점 부여, 텍스트 후기 작성, 이미지/동영상 첨부 기능을 포함합니다.
 */
const MyReviewModal: React.FC<ReviewModalProps> = ({
	open,
	onOpenChange,
	enrollmentId,
	isEditMode: initialIsEditMode = false,
}) => {
	const { mutateAsync: writeReview, isPending: isWriting } = useReviewMutation();
	const { mutateAsync: updateReview, isPending: isUpdating } = useUpdateReviewMutation();
	const [isImageAlertOpen, setIsImageAlertOpen] = React.useState(false);
	// 기존 이미지 URL -> 슬롯 번호(1~8) 매핑 저장
	const [initialUrlToSlotMap, setInitialUrlToSlotMap] = React.useState<Record<string, number>>(
		{},
	);
	// 삭제된 기존 이미지의 슬롯 번호들
	const [removeSequences, setRemoveSequences] = React.useState<number[]>([]);

	const fileInputRef = useRef<HTMLInputElement>(null);
	const {
		control,
		handleSubmit,
		register,
		getValues,
		setValue,
		reset,
		formState: { isValid },
	} = useForm<ReviewFormData>({
		resolver: zodResolver(reviewSchema),
		defaultValues: {
			rating: 0,
			content: '',
			images: [],
			imageFiles: [],
		},
		mode: 'onChange',
	});

	// 기존 리뷰 데이터 조회 (모달이 열릴 때만 조회하도록 최적화)
	const { data: existingReview, isLoading: isDataLoading } = useMyReviewQuery(enrollmentId || 0, {
		enabled: open && initialIsEditMode, // 수정 모드일 때만 데이터 로드
	});
	const isEditMode = initialIsEditMode;

	// 데이터 로드 시 폼 초기화
	useEffect(() => {
		// 데이터를 불러오는 중일 때는 초기화를 건너뛰어 빈 화면이 보이지 않게 함
		if (isDataLoading) return;

		if (existingReview?.hasReview && existingReview.review && open) {
			const review = existingReview.review;

			// image1~image8 슬롯 맵 생성
			const slotMap: Record<string, number> = {};
			const imagesWithSlots = [
				{ url: review.image1, slot: 1 },
				{ url: review.image2, slot: 2 },
				{ url: review.image3, slot: 3 },
				{ url: review.image4, slot: 4 },
				{ url: review.image5, slot: 5 },
				{ url: review.image6, slot: 6 },
				{ url: review.image7, slot: 7 },
				{ url: review.image8, slot: 8 },
			];

			const existingImages: string[] = [];
			imagesWithSlots.forEach((item) => {
				if (item.url) {
					existingImages.push(item.url);
					slotMap[item.url] = item.slot;
				}
			});

			setInitialUrlToSlotMap(slotMap);
			setRemoveSequences([]); // 초기화

			reset({
				rating: review.rating ?? 0,
				content: review.content ?? '',
				images: existingImages,
				imageFiles: [],
			});
		} else if (!open) {
			setInitialUrlToSlotMap({});
			setRemoveSequences([]);
			reset({
				rating: 0,
				content: '',
				images: [],
				imageFiles: [],
			});
		}
	}, [existingReview, reset, open, isDataLoading]);

	// 이미지 상태 감시 (성능 최적화 및 커스텀 핸들링 위해)
	const images = useWatch({ control, name: 'images' });

	// 이미지 변경 핸들러: images(미리보기)와 imageFiles(실제 파일) 동시 업데이트
	const handleImagesChange = (dataUrls: string[], newFiles: File[]) => {
		setValue('images', dataUrls, { shouldValidate: true });
		const currentFiles = getValues('imageFiles') || [];
		setValue('imageFiles', [...currentFiles, ...newFiles], { shouldValidate: true });
	};

	// 이미지 삭제 콜백 (images와 imageFiles의 동기화 보장 및 삭제 슬롯 추적)
	const handleRemoveImage = useCallback(
		(index: number) => {
			const currentImages = getValues('images');
			const targetImage = currentImages[index];

			// 1. 기존 이미지 삭제인 경우 removeSequences에 기록
			if (targetImage && initialUrlToSlotMap[targetImage]) {
				const slot = initialUrlToSlotMap[targetImage];
				setRemoveSequences((prev) => Array.from(new Set([...prev, slot])));
			}

			// 2. 폼 상태 업데이트
			const currentFiles = getValues('imageFiles') || [];
			const firstNewFileIndex = currentImages.length - currentFiles.length;

			if (index >= firstNewFileIndex) {
				const fileIndex = index - firstNewFileIndex;
				setValue(
					'imageFiles',
					currentFiles.filter((_, i) => i !== fileIndex),
					{ shouldValidate: true },
				);
			}

			setValue(
				'images',
				currentImages.filter((_, i) => i !== index),
				{ shouldValidate: true },
			);
		},
		[setValue, getValues, initialUrlToSlotMap],
	);

	/**
	 * 후기 등록 처리
	 */
	const onSubmit = async (data: ReviewFormData) => {
		if (!enrollmentId) return;

		const formData = new FormData();

		// 신규 작성 시에만 enrollmentId 전송 (백엔드 UpdateReviewDto는 이 필드를 허용하지 않음)
		if (!isEditMode) {
			formData.append('enrollmentId', enrollmentId.toString());
		}

		formData.append('rating', data.rating.toString());
		formData.append('content', data.content);

		// 이미지 처리
		if (isEditMode) {
			const existingUrls = data.images.filter((img) => img.startsWith('http'));
			const newFiles = data.imageFiles ?? [];

			// 1. 이미지 삭제 제한 체크
			const originalImagesCount = Object.keys(initialUrlToSlotMap).length;
			const isCurrentlyEmpty = existingUrls.length === 0 && newFiles.length === 0;

			if (originalImagesCount > 0 && isCurrentlyEmpty) {
				setIsImageAlertOpen(true);
				return;
			}

			// 2. 삭제된 시퀀스 추가
			removeSequences.forEach((seq) => {
				formData.append('removeSequences', seq.toString());
			});

			// 3. 신규 파일 슬롯 할당
			// 현재 사용 중인 슬롯 번호들 (URL을 통해 추적)
			const usedSlots = new Set(
				existingUrls.map((url) => initialUrlToSlotMap[url]).filter(Boolean),
			);
			// 사용 가능한 슬롯 번호 (1~8 중 사용 중이지 않은 것)
			const availableSlots = [1, 2, 3, 4, 5, 6, 7, 8].filter((slot) => !usedSlots.has(slot));

			newFiles.forEach((file, i) => {
				const slot = availableSlots[i];
				if (slot) {
					formData.append(`image${slot}`, file);
				}
			});
		} else {
			// 신규 작성 모드
			if (data.imageFiles && data.imageFiles.length > 0) {
				data.imageFiles.forEach((file, i) => {
					formData.append(`image${i + 1}`, file);
				});
			}
		}

		if (isEditMode && existingReview?.hasReview && existingReview.review?.id !== undefined) {
			// 수정 로직 (훅 사용)
			await updateReview({
				reviewId: existingReview.review.id,
				enrollmentId: enrollmentId!,
				data: formData,
			});
		} else {
			// 등록 로직 (훅 사용)
			await writeReview(formData);
		}
		onOpenChange(false);
	};

	return (
		<FormModal
			isOpen={open}
			onClose={() => onOpenChange(false)}
			onSubmit={handleSubmit(onSubmit)}
			title={isEditMode ? '클래스 리뷰 수정' : '클래스 리뷰 작성'}
			submitButtonText={isEditMode ? '수정' : '등록'}
			isSubmitDisabled={!isValid || isDataLoading}
			isLoading={isWriting || isUpdating || isDataLoading}
			loadingComponent={
				isDataLoading ? (
					<div className="flex flex-col items-center justify-center py-20 gap-4">
						<LoadingSpinner />
					</div>
				) : null
			}
			containerClassName="sm:max-w-[440px]"
		>
			<div className="flex flex-col items-center gap-8">
				{/* 상단: 별점 평가 섹션 */}
				<div className="text-center space-y-3">
					<h2 className="text-lg font-bold text-gray-900">클래스에 만족하셨나요?</h2>
					<Controller
						name="rating"
						control={control}
						render={({ field }) => (
							<StarRating
								rating={field.value}
								isEditable
								onChange={field.onChange}
								starSize={48}
								className="justify-center"
								filledColor="text-yellow-400"
								emptyColor="text-gray-200"
							/>
						)}
					/>
					<RatingText control={control} />
				</div>

				{/* 중단: 텍스트 후기 내용 섹션 */}
				<div className="w-full space-y-4">
					<h3 className="text-lg font-bold text-center text-gray-900">
						어떤 점이 좋았나요?
					</h3>
					<div className="relative">
						<Textarea
							{...register('content')}
							placeholder="(최소 10자 이상)"
							className="min-h-[220px] resize-none border-gray-200 bg-white placeholder:text-gray-300 text-sm p-4 focus:ring-0 focus:border-purple-300 rounded-sm"
							maxLength={5000}
						/>
						<CharacterCounter control={control} />
					</div>
				</div>

				{/* 하단: 파일 첨부 섹션 */}
				<div className="w-full space-y-4">
					<FormImageUpload
						ref={fileInputRef}
						variant="multiple"
						previewImages={images}
						onImagesChange={handleImagesChange}
						onRemoveImage={handleRemoveImage}
						maxImages={8}
						enableDragAndDrop={true}
						dragDropHintText={
							<p>
								첨부하면{' '}
								<span className="text-emerald-500 font-bold">
									원데이클래스 10% 할인 쿠폰 발급!
								</span>
							</p>
						}
						label="이미지 첨부"
					/>

					{/* 포인트 적립 안내 문구 */}
					<p className="text-[11px] leading-snug text-emerald-500 font-bold whitespace-pre-wrap">
						리뷰를 등록하면 포인트 1,000원 적립!
					</p>
				</div>
			</div>
			<AlertNotification
				open={isImageAlertOpen}
				onOpenChange={setIsImageAlertOpen}
				title="알림"
				description="이미지 리뷰 작성 보상 쿠폰을 받았으므로 모든 이미지 삭제는 불가합니다"
				hasButton={true}
			/>
		</FormModal>
	);
};

export default MyReviewModal;
