import { useEffect, useRef, useState } from 'react';

import FormField from '@components/common/FormField';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { RegionSelect } from '@/components/common/RegionSelect';
import { SelectableBadge } from '@/components/common/SelectableBadge';
import KakaoMapSearch from '@/components/features/map/kakaoMaps/KakaoMapSearch';
import { FormImageUpload } from '@/components/features/modal/components/FormImageUpload';
import { FormInput } from '@/components/features/modal/components/FormInput';
import { FormModal } from '@/components/features/modal/components/FormModal';
import { FormTextarea } from '@/components/features/modal/components/FormTextarea';
import { Slider } from '@/components/ui/slider';
import { useCategoryQuery, useSubCategoryQuery } from '@/hooks/useCategoryQuery';
import { useCreateLessonMutation, useUpdateLessonMutation } from '@/hooks/useLessonMutations';
import { useLessonQuery } from '@/hooks/useLessonQuery';
import { cn } from '@/lib/utils';
import type { PlaceInfo } from '@/models/kakao-maps.model';
import type { Level } from '@/models/lesson.model';

// Zod 스키마 정의
const classSchema = z.object({
	title: z.string().min(1, '클래스명을 입력해주세요').max(100, '100자 이내로 입력해주세요'),
	description: z
		.string()
		.min(1, '클래스 소개를 입력해주세요')
		.max(4000, '4000자 이내로 입력해주세요'),
	curriculum: z
		.string()
		.min(40, '커리큘럼은 40자 이상 입력해주세요')
		.max(600, '600자 이내로 입력해주세요'),
	classCategoryId: z.number({ message: '대분류 카테고리를 선택해주세요' }).min(1),
	subCategoryIds: z.array(z.number()).min(1, '소분류 카테고리를 최소 1개 선택해주세요'),
	level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'], { message: '난이도를 선택해주세요' }),
	duration: z.number().min(30, '최소 30분 이상').max(480, '최대 8시간까지'),
	price: z.number().min(0, '가격을 입력해주세요'),
	discountRate: z.number().min(0).max(100),
	maxParticipants: z.number().min(1, '최소 1명 이상').max(50, '최대 50명까지'),
	regionId: z.number().min(1, '지역을 선택해주세요'),
	address: z.string().min(1, '클래스 장소를 입력해주세요'),
	latitude: z.number(),
	longitude: z.number(),
	detailAddress: z.string().optional(),
	directionsText: z.string().optional(),
	reservationLeadDays: z.number().min(0).max(10),
});

type ClassFormValues = z.infer<typeof classSchema>;

interface CreateClassModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	classId?: number; // 수정 모드용
}

const LEVEL_OPTIONS: { value: Level; label: string; description: string }[] = [
	{ value: 'BEGINNER', label: '초급', description: '처음 시작하는 분들을 위한' },
	{ value: 'INTERMEDIATE', label: '중급', description: '기본기가 있는 분들을 위한' },
	{ value: 'ADVANCED', label: '고급', description: '전문적인 실력 향상을 위한' },
];

function CreateClassModal({ open, onOpenChange, classId }: CreateClassModalProps) {
	const representativeImageRef = useRef<HTMLInputElement>(null);
	const additionalImagesRef = useRef<HTMLInputElement>(null);
	const prevCategoryIdRef = useRef<number | null>(null);
	const [previewImage, setPreviewImage] = useState<string | null>(null);
	const [additionalImages, setAdditionalImages] = useState<string[]>([]);

	const { mutateAsync: createLessonMutation } = useCreateLessonMutation();
	const { mutateAsync: updateLessonMutation } = useUpdateLessonMutation();

	// 수정 모드일 때 기존 레슨 데이터 불러오기
	const { data: existingLesson } = useLessonQuery(classId || 0);

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		reset,
		control,
		formState: { errors, isValid },
	} = useForm<ClassFormValues>({
		resolver: zodResolver(classSchema),
		mode: 'onChange',
		defaultValues: {
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
		},
	});

	const selectedCategoryId = watch('classCategoryId');
	const { data: categories } = useCategoryQuery();
	const { data: subCategories, isLoading: isSubCategoriesLoading } =
		useSubCategoryQuery(selectedCategoryId);

	const isFormReady =
		open && selectedCategoryId > 0 && !isSubCategoriesLoading && !!subCategories;

	const selectedSubCategoryIds = watch('subCategoryIds');
	const selectedLevel = watch('level');
	const duration = watch('duration');
	const price = watch('price');
	const discountRate = watch('discountRate');
	const maxParticipants = watch('maxParticipants');
	const reservationLeadDays = watch('reservationLeadDays');

	useEffect(() => {
		if (open) {
			if (classId && existingLesson) {
				// 수정 모드 - 기존 데이터로 폼 채우기
				const subCategoryIds =
					existingLesson.subClassCategories?.map((sub) => sub.id) || [];

				reset({
					title: existingLesson.title,
					description: existingLesson.description,
					curriculum: existingLesson.curriculum,
					classCategoryId: existingLesson.classCategoryId,
					subCategoryIds: subCategoryIds,
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

				// 이미지 미리보기 설정
				setPreviewImage(existingLesson.representativeImage);
				if (existingLesson.lessonImages && existingLesson.lessonImages.length > 0) {
					setAdditionalImages(existingLesson.lessonImages.map((img) => img.image));
				}

				prevCategoryIdRef.current = existingLesson.classCategoryId;
			} else {
				// 생성 모드 - 테스트용 기본값으로 이후에 수정할 예정입니다
				reset({
					title: '테스트 클래스',
					description:
						'이것은 테스트용 클래스 설명입니다. 실제 서비스에서는 이 내용을 수정해주세요.',
					curriculum:
						'1. 첫 번째 커리큘럼 내용입니다.\n2. 두 번째 커리큘럼 내용입니다.\n3. 세 번째 커리큘럼 내용입니다.',
					classCategoryId: 1, // 핸드메이드
					subCategoryIds: [2], // 향수
					level: 'BEGINNER',
					duration: 120,
					price: 50000,
					discountRate: 10,
					maxParticipants: 10,
					regionId: 1, // 서울
					address: '서울특별시 강남구 테헤란로 123',
					latitude: 37.5665,
					longitude: 126.978,
					detailAddress: '4층 401호',
					directionsText: '강남역 2번 출구에서 도보 5분',
					reservationLeadDays: 3,
				});
				setPreviewImage(null);
				setAdditionalImages([]);
				prevCategoryIdRef.current = 1; // 핸드메이드로 설정하여 소분류 초기화 방지
			}
		}
	}, [open, classId, existingLesson, reset]);

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

	const toggleCategory = (categoryId: number) => {
		setValue('classCategoryId', categoryId, { shouldValidate: true });
	};

	const toggleSubCategory = (subCategoryId: number) => {
		const currentIds = [...selectedSubCategoryIds];
		const index = currentIds.indexOf(subCategoryId);

		if (index > -1) {
			currentIds.splice(index, 1);
		} else {
			currentIds.push(subCategoryId);
		}

		setValue('subCategoryIds', currentIds, { shouldValidate: true });
	};

	const handleImageChange = (dataUrl: string) => {
		setPreviewImage(dataUrl);
	};

	const handleAdditionalImagesChange = (dataUrls: string[]) => {
		setAdditionalImages(dataUrls);
	};

	const removeRepresentativeImage = () => {
		setPreviewImage(null);
	};

	const removeAdditionalImage = (index: number) => {
		setAdditionalImages(additionalImages.filter((_, i) => i !== index));
	};

	const handlePlaceSelect = (place: PlaceInfo) => {
		setValue('address', place.roadAddress || place.address, { shouldValidate: true });
		setValue('latitude', place.lat, { shouldValidate: true });
		setValue('longitude', place.lng, { shouldValidate: true });
	};

	const handleLevelSelect = (level: Level) => {
		setValue('level', level, { shouldValidate: true });
	};

	const onSubmit = async (data: ClassFormValues) => {
		try {
			const formData = new FormData();
			formData.append('title', data.title);
			formData.append('description', data.description);
			formData.append('curriculum', data.curriculum);
			formData.append('lessonCategoryId', data.classCategoryId.toString());
			formData.append('subCategoryIds', JSON.stringify(data.subCategoryIds));
			formData.append('level', data.level);
			formData.append('durationMin', data.duration.toString());
			formData.append('price', data.price.toString());
			formData.append('discountRate', data.discountRate.toString());
			formData.append(
				'discountedPrice',
				Math.round(data.price * (1 - data.discountRate / 100)).toString(),
			);
			formData.append('maxParticipants', data.maxParticipants.toString());
			formData.append('regionId', data.regionId.toString());
			formData.append('address', data.address);
			formData.append('latitude', data.latitude.toString());
			formData.append('longitude', data.longitude.toString());
			formData.append('detailAddress', data.detailAddress || '');
			formData.append('directionsText', data.directionsText || '');
			formData.append('reservationLeadDays', data.reservationLeadDays.toString());

			const repFile = representativeImageRef.current?.files?.[0];
			if (repFile) {
				formData.append('representativeImage', repFile);
			}

			const addFiles = additionalImagesRef.current?.files;
			if (addFiles && addFiles.length > 0) {
				for (let i = 0; i < addFiles.length; i++) {
					formData.append('lessonImages', addFiles[i]);
				}
			}

			if (classId) {
				await updateLessonMutation({ lessonId: classId, formData });
				toast.success('클래스 수정 완료', {
					description: '클래스가 성공적으로 수정되었습니다!',
				});
			} else {
				await createLessonMutation(formData);
				toast.success('클래스 생성 완료', {
					description: '클래스가 성공적으로 생성되었습니다!',
				});
			}

			onOpenChange(false);
		} catch (error) {
			console.error('클래스 처리 실패:', error);
			toast.error('오류 발생', {
				description: '클래스 처리 중 오류가 발생했습니다.',
			});
		}
	};

	const discountedPrice = Math.round(price * (1 - discountRate / 100));

	return (
		<FormModal
			isOpen={open}
			onClose={() => onOpenChange(false)}
			onSubmit={handleSubmit(onSubmit)}
			title={classId ? '클래스 정보 수정하기' : '새 클래스 만들기'}
			submitButtonText={classId ? '수정하기' : '생성하기'}
			isSubmitDisabled={!isValid}
			isLoading={!isFormReady}
			containerClassName="max-w-2xl"
		>
			{/* 클래스명 */}
			<FormInput
				id="title"
				label="클래스명"
				register={register('title')}
				placeholder="매력적인 클래스명을 입력하세요 (100자 이내)"
				maxLength={100}
				currentLength={watch('title')?.length || 0}
				error={errors.title?.message}
				required
			/>

			{/* 클래스 소개 */}
			<FormTextarea
				id="description"
				label="클래스 소개"
				register={register('description')}
				placeholder="클래스에 대해 자유롭게 설명해주세요 (4000자 이내)"
				maxLength={4000}
				currentLength={watch('description')?.length || 0}
				error={errors.description?.message}
				className="min-h-[120px]"
				required
			/>

			{/* 대분류 카테고리 선택 */}
			<FormField
				label="대분류 카테고리"
				description="클래스의 카테고리를 선택해주세요"
				required
			>
				<div className="flex flex-wrap gap-2">
					{categories?.map((category) => (
						<SelectableBadge
							key={category.id}
							label={category.name}
							isSelected={selectedCategoryId === category.id}
							onClick={() => toggleCategory(category.id)}
							size="md"
						/>
					))}
				</div>
				{errors.classCategoryId && (
					<p className="text-xs text-red-500 mt-1">{errors.classCategoryId.message}</p>
				)}
			</FormField>

			{/* 소분류 카테고리 선택 */}
			{selectedCategoryId > 0 &&
				subCategories &&
				subCategories.length > 0 &&
				(() => {
					console.log('🔍 소분류 렌더링:', {
						selectedCategoryId,
						subCategories,
						selectedSubCategoryIds,
					});
					return (
						<FormField
							label="소분류 카테고리"
							description="클래스의 소분류 카테고리를 선택해주세요 (복수 선택 가능)"
							required
						>
							<div className="flex flex-wrap gap-2">
								{subCategories.map((subCategory) => {
									const isSelected = selectedSubCategoryIds.includes(
										subCategory.id,
									);
									console.log(
										`  - ${subCategory.name} (ID: ${subCategory.id}): ${isSelected ? '✅ 선택됨' : '❌ 선택안됨'}`,
									);
									return (
										<SelectableBadge
											key={subCategory.id}
											label={subCategory.name}
											isSelected={isSelected}
											onClick={() => toggleSubCategory(subCategory.id)}
											size="md"
										/>
									);
								})}
							</div>
							{errors.subCategoryIds && (
								<p className="text-xs text-red-500 mt-1">
									{errors.subCategoryIds.message}
								</p>
							)}
						</FormField>
					);
				})()}

			{/* 클래스 대표 사진 */}
			<FormImageUpload
				ref={representativeImageRef}
				variant="form"
				shape="square"
				previewImage={previewImage}
				onImageChange={handleImageChange}
				onRemoveImage={removeRepresentativeImage}
				label="클래스 대표 사진 (썸네일)"
				description="클래스를 대표할 사진을 선택해주세요 (4.5MB 이하)"
			/>

			{/* 추가 이미지 */}
			<FormImageUpload
				ref={additionalImagesRef}
				variant="multiple"
				shape="square"
				previewImages={additionalImages}
				onImagesChange={handleAdditionalImagesChange}
				onRemoveImage={removeAdditionalImage}
				label="추가 이미지 (선택)"
				description="클래스를 소개할 추가 이미지를 업로드하세요 (최대 5장)"
				maxImages={5}
			/>

			{/* 커리큘럼 */}
			<FormTextarea
				id="curriculum"
				label="커리큘럼"
				register={register('curriculum')}
				placeholder="클래스에서 배울 내용을 구체적으로 작성해주세요 (40~600자)"
				maxLength={600}
				minLength={40}
				currentLength={watch('curriculum')?.length || 0}
				error={errors.curriculum?.message}
				className="min-h-[120px]"
				required
			/>

			{/* 난이도 선택 */}
			<FormField label="난이도" description="클래스의 난이도를 선택해주세요" required>
				<div className="grid grid-cols-3 gap-3">
					{LEVEL_OPTIONS.map((option) => (
						<button
							key={option.value}
							type="button"
							onClick={() => handleLevelSelect(option.value)}
							className={cn(
								'p-4 rounded-lg border-2 transition-all text-left',
								selectedLevel === option.value
									? 'border-primary bg-primary/5'
									: 'border-gray-200 hover:border-gray-300',
							)}
						>
							<div className="font-bold text-sm">{option.label}</div>
							<div className="text-xs text-gray-500 mt-1">{option.description}</div>
						</button>
					))}
				</div>
				{errors.level && (
					<p className="text-xs text-red-500 mt-1">{errors.level.message}</p>
				)}
			</FormField>

			{/* 소요 시간 */}
			<FormField
				label="소요 시간"
				description={`${duration}분 (${Math.floor(duration / 60)}시간 ${duration % 60}분)`}
				required
			>
				<Controller
					name="duration"
					control={control}
					render={({ field }) => (
						<Slider
							min={30}
							max={480}
							step={30}
							value={[field.value]}
							onValueChange={(value) => field.onChange(value[0])}
							className="w-full"
						/>
					)}
				/>
				{errors.duration && (
					<p className="text-xs text-red-500 mt-1">{errors.duration.message}</p>
				)}
			</FormField>

			{/* 가격 및 할인 */}
			<div className="space-y-3">
				<div className="grid grid-cols-2 gap-4">
					<FormInput
						id="price"
						label="가격"
						register={register('price', { valueAsNumber: true })}
						placeholder="0"
						suffix="원"
						error={errors.price?.message}
						required
						onFocus={(e) => {
							if (e.target.value === '0') {
								setValue('price', '' as any);
							}
						}}
					/>
					<FormInput
						id="discountRate"
						label="할인율"
						register={register('discountRate', { valueAsNumber: true })}
						placeholder="0"
						suffix="%"
						error={errors.discountRate?.message}
						onFocus={(e) => {
							if (e.target.value === '0') {
								setValue('discountRate', '' as any);
							}
						}}
					/>
				</div>

				{/* 최종 판매가 */}
				{price > 0 && (
					<div className="p-4 bg-primary/5 rounded-lg border border-primary/10 flex justify-between items-center">
						<span className="text-sm text-gray-600 font-medium">최종 판매가</span>
						<div className="text-right">
							{discountRate > 0 && (
								<p className="text-xs text-gray-400 line-through mb-0.5">
									{price.toLocaleString()}원
								</p>
							)}
							<p className="text-lg font-bold text-primary">
								{discountedPrice.toLocaleString()}원
							</p>
						</div>
					</div>
				)}
			</div>

			{/* 최대 인원 */}
			<FormField label="최대 인원" description={`최대 ${maxParticipants}명`} required>
				<Controller
					name="maxParticipants"
					control={control}
					render={({ field }) => (
						<Slider
							min={1}
							max={50}
							step={1}
							value={[field.value]}
							onValueChange={(value) => field.onChange(value[0])}
							className="w-full"
						/>
					)}
				/>
				{errors.maxParticipants && (
					<p className="text-xs text-red-500 mt-1">{errors.maxParticipants.message}</p>
				)}
			</FormField>

			{/* 지역 선택 */}
			<FormField label="지역" description="클래스가 진행될 지역을 선택해주세요" required>
				<Controller
					name="regionId"
					control={control}
					render={({ field }) => (
						<RegionSelect value={field.value} onValueChange={field.onChange} />
					)}
				/>
				{errors.regionId && (
					<p className="text-xs text-red-500 mt-1">{errors.regionId.message}</p>
				)}
			</FormField>

			{/* 클래스 장소 */}
			<FormField label="장소" description="카카오맵에서 장소를 검색하여 선택해주세요">
				<KakaoMapSearch onPlaceSelect={handlePlaceSelect} defaultValue={watch('address')} />
				{errors.address && (
					<p className="text-xs text-red-500 mt-1">{errors.address.message}</p>
				)}
			</FormField>

			<FormInput
				id="detailAddress"
				label="상세 주소"
				register={register('detailAddress')}
				placeholder="상세 주소를 입력하세요 (선택)"
				error={errors.detailAddress?.message}
			/>

			<FormTextarea
				id="directionsText"
				label="찾아오는 길"
				register={register('directionsText')}
				placeholder="클래스 장소를 찾아오는 방법을 설명해주세요 (선택)"
				error={errors.directionsText?.message}
				className="min-h-[80px]"
			/>

			{/* 예약 가능 기간 */}
			<FormField
				label="예약 가능 기간"
				description={
					reservationLeadDays === 0
						? '당일 예약 가능'
						: `${reservationLeadDays}일 전부터 예약 가능`
				}
				required
			>
				<Controller
					name="reservationLeadDays"
					control={control}
					render={({ field }) => (
						<Slider
							min={0}
							max={10}
							step={1}
							value={[field.value]}
							onValueChange={(value) => field.onChange(value[0])}
							className="w-full"
						/>
					)}
				/>
				{errors.reservationLeadDays && (
					<p className="text-xs text-red-500 mt-1">
						{errors.reservationLeadDays.message}
					</p>
				)}
			</FormField>
		</FormModal>
	);
}

export default CreateClassModal;
