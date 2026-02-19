'use client';

import React, { useCallback, useRef } from 'react';
import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller, useWatch, type Control } from 'react-hook-form';
import { z } from 'zod';

import LoadingSpinner from '@/components/common/LoadingSpinner';
import StarRating from '@/components/common/StarRating';
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
	/** 후기를 작성할 클래스 아이디 */
	lessonId?: number;
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
	lessonId,
	isEditMode: initialIsEditMode = false,
}) => {
	const { mutateAsync: writeReview, isPending: isWriting } = useReviewMutation();
	const { mutateAsync: updateReview, isPending: isUpdating } = useUpdateReviewMutation();
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
	const { data: existingReview, isLoading: isDataLoading } = useMyReviewQuery(lessonId || 0, {
		enabled: open && initialIsEditMode, // 수정 모드일 때만 데이터 로드
	});
	const isEditMode = initialIsEditMode;

	// 데이터 로드 시 폼 초기화
	useEffect(() => {
		if (existingReview && open) {
			reset({
				rating: existingReview.rating,
				content: existingReview.content,
				images: existingReview.images || [],
				imageFiles: [],
			});
		} else if (!open) {
			reset({
				rating: 0,
				content: '',
				images: [],
				imageFiles: [],
			});
		}
	}, [existingReview, reset, open]);

	// 이미지 상태 감시 (성능 최적화 및 커스텀 핸들링 위해)
	const images = useWatch({ control, name: 'images' });

	// 이미지 변경 핸들러: images(미리보기)와 imageFiles(실제 파일) 동시 업데이트
	const handleImagesChange = (dataUrls: string[], newFiles: File[]) => {
		setValue('images', dataUrls, { shouldValidate: true });
		const currentFiles = getValues('imageFiles') || [];
		setValue('imageFiles', [...currentFiles, ...newFiles], { shouldValidate: true });
	};

	// 이미지 삭제 콜백 (images와 imageFiles의 동기화 보장)
	const handleRemoveImage = useCallback(
		(index: number) => {
			const currentImages = getValues('images');
			const currentFiles = getValues('imageFiles');

			// 기존 이미지와 신규 파일이 섞여 있을 때를 대비한 동기화 로직
			// 신규 파일은 항상 currentImages 배열의 끝에 추가됨
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
		[setValue, getValues],
	);

	/**
	 * 후기 등록 처리
	 */
	const onSubmit = async (data: ReviewFormData) => {
		if (!lessonId) return;

		const formData = new FormData();
		formData.append('lessonId', lessonId.toString());
		formData.append('rating', data.rating.toString());
		formData.append('content', data.content);

		if (data.imageFiles && data.imageFiles.length > 0) {
			data.imageFiles.forEach((file, i) => {
				formData.append(`image${i + 1}`, file);
			});
		}

		if (isEditMode && existingReview && existingReview.id !== undefined) {
			// 수정 로직 (훅 사용)
			await updateReview({
				reviewId: existingReview.id,
				lessonId,
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
		</FormModal>
	);
};

export default MyReviewModal;
