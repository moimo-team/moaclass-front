import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";
import FormField from "@components/common/FormField";
import { FormModal } from "@/components/features/modal/components/FormModal";
import { FormImageUpload } from "@/components/features/modal/components/FormImageUpload";
import { FormInput } from "@/components/features/modal/components/FormInput";
import { FormTextarea } from "@/components/features/modal/components/FormTextarea";
import { RegionSelect } from "@/components/common/RegionSelect";
import KakaoMapSearch from "@/components/features/map/kakaoMaps/KakaoMapSearch";
import { SelectableBadge } from "@/components/common/SelectableBadge";
import { cn } from "@/lib/utils";
import type { Level } from "@/models/lesson.model";
import type { PlaceInfo } from "@/models/kakao-maps.model";
import { LESSON_CATEGORIES, LESSON_SUB_CATEGORIES } from "@/mock/mockData/categoryMock";

// Zod 스키마 정의
const classSchema = z.object({
  title: z.string().min(1, "클래스명을 입력해주세요").max(100, "100자 이내로 입력해주세요"),
  description: z.string().min(1, "클래스 소개를 입력해주세요").max(4000, "4000자 이내로 입력해주세요"),
  curriculum: z.string().min(40, "커리큘럼은 40자 이상 입력해주세요").max(600, "600자 이내로 입력해주세요"),
  classCategoryId: z.number({ message: "대분류 카테고리를 선택해주세요" }).min(1),
  subCategoryIds: z.array(z.number()).min(1, "소분류 카테고리를 최소 1개 선택해주세요"),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"], { message: "난이도를 선택해주세요" }),
  durationMin: z.number().min(30, "최소 30분 이상").max(480, "최대 8시간까지"),
  price: z.number().min(0, "가격을 입력해주세요"),
  discountRate: z.number().min(0).max(100),
  maxParticipants: z.number().min(1, "최소 1명 이상").max(50, "최대 50명까지"),
  regionId: z.number().min(1, "지역을 선택해주세요"),
  address: z.string().min(1, "클래스 장소를 입력해주세요"),
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
  { value: "BEGINNER", label: "초급", description: "처음 시작하는 분들을 위한" },
  { value: "INTERMEDIATE", label: "중급", description: "기본기가 있는 분들을 위한" },
  { value: "ADVANCED", label: "고급", description: "전문적인 실력 향상을 위한" },
];

function CreateClassModal({ open, onOpenChange, classId }: CreateClassModalProps) {
  const representativeImageRef = useRef<HTMLInputElement>(null);
  const additionalImagesRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [isFormReady, setIsFormReady] = useState(false);

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
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      curriculum: "",
      classCategoryId: 0,
      subCategoryIds: [],
      level: "BEGINNER",
      durationMin: 60,
      price: 0,
      discountRate: 0,
      maxParticipants: 10,
      regionId: 0,
      address: "",
      latitude: 0,
      longitude: 0,
      detailAddress: "",
      directionsText: "",
      reservationLeadDays: 1,
    },
  });

  const selectedCategoryId = watch("classCategoryId");
  const selectedSubCategoryIds = watch("subCategoryIds");
  const selectedLevel = watch("level");
  const durationMin = watch("durationMin");
  const price = watch("price");
  const discountRate = watch("discountRate");
  const maxParticipants = watch("maxParticipants");
  const reservationLeadDays = watch("reservationLeadDays");

  // 선택된 대분류에 해당하는 소분류 필터링
  const availableSubCategories = LESSON_SUB_CATEGORIES.filter(
    (sub) => sub.category_id === selectedCategoryId
  );

  useEffect(() => {
    if (open) {
      if (classId) {
        // TODO: 수정 모드 - API에서 클래스 정보 가져오기
        setIsFormReady(true);
      } else {
        // 생성 모드
        reset({
          title: "",
          description: "",
          curriculum: "",
          classCategoryId: 0,
          subCategoryIds: [],
          level: "BEGINNER",
          durationMin: 60,
          price: 0,
          discountRate: 0,
          maxParticipants: 10,
          regionId: 0,
          address: "",
          latitude: 0,
          longitude: 0,
          detailAddress: "",
          directionsText: "",
          reservationLeadDays: 1,
        });
        setPreviewImage(null);
        setAdditionalImages([]);
        setIsFormReady(true);
      }
    }
  }, [open, classId, reset]);

  // 대분류 카테고리 변경 시 소분류 초기화
  useEffect(() => {
    if (selectedCategoryId) {
      setValue("subCategoryIds", []);
    }
  }, [selectedCategoryId, setValue]);

  const toggleCategory = (categoryId: number) => {
    setValue("classCategoryId", categoryId, { shouldValidate: true });
  };

  const toggleSubCategory = (subCategoryId: number) => {
    const currentIds = [...selectedSubCategoryIds];
    const index = currentIds.indexOf(subCategoryId);

    if (index > -1) {
      currentIds.splice(index, 1);
    } else {
      currentIds.push(subCategoryId);
    }

    setValue("subCategoryIds", currentIds, { shouldValidate: true });
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
    setValue("address", place.roadAddress || place.address, { shouldValidate: true });
    setValue("latitude", place.lat, { shouldValidate: true });
    setValue("longitude", place.lng, { shouldValidate: true });
  };

  const handleLevelSelect = (level: Level) => {
    setValue("level", level, { shouldValidate: true });
  };

  const onSubmit = async (data: ClassFormValues) => {
    try {
      // TODO: FormData 생성 및 API 호출
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("curriculum", data.curriculum);
      formData.append("classCategoryId", data.classCategoryId.toString());
      formData.append("subCategoryIds", JSON.stringify(data.subCategoryIds));
      formData.append("level", data.level);
      formData.append("durationMin", data.durationMin.toString());
      formData.append("price", data.price.toString());
      formData.append("discountRate", data.discountRate.toString());
      formData.append("maxParticipants", data.maxParticipants.toString());
      formData.append("regionId", data.regionId.toString());
      formData.append("address", data.address);
      formData.append("latitude", data.latitude.toString());
      formData.append("longitude", data.longitude.toString());
      if (data.detailAddress) formData.append("detailAddress", data.detailAddress);
      if (data.directionsText) formData.append("directionsText", data.directionsText);
      formData.append("reservationLeadDays", data.reservationLeadDays.toString());

      if (representativeImageRef.current?.files?.[0]) {
        formData.append("representativeImage", representativeImageRef.current.files[0]);
      }

      // TODO: 추가 이미지들도 FormData에 추가
      // additionalImages.forEach((image, index) => {
      //   formData.append(`lessonImages[${index}]`, image);
      // });

      toast.success(classId ? "클래스가 수정되었습니다" : "클래스가 생성되었습니다");
      onOpenChange(false);
    } catch (error) {
      console.error("Class submission failed:", error);
      toast.error(classId ? "클래스 수정에 실패했습니다" : "클래스 생성에 실패했습니다");
    }
  };

  const discountedPrice = Math.round(price * (1 - discountRate / 100));

  return (
    <FormModal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      onSubmit={handleSubmit(onSubmit)}
      title={classId ? "클래스 정보 수정하기" : "새 클래스 만들기"}
      submitButtonText={classId ? "수정하기" : "생성하기"}
      isSubmitDisabled={!isValid}
      isLoading={!isFormReady}
      containerClassName="max-w-2xl"
    >
      {/* 클래스명 */}
      <FormInput
        id="title"
        label="클래스명"
        register={register("title")}
        placeholder="매력적인 클래스명을 입력하세요 (100자 이내)"
        maxLength={100}
        currentLength={watch("title")?.length || 0}
        error={errors.title?.message}
        required
      />

      {/* 클래스 소개 */}
      <FormTextarea
        id="description"
        label="클래스 소개"
        register={register("description")}
        placeholder="클래스에 대해 자유롭게 설명해주세요 (4000자 이내)"
        maxLength={4000}
        currentLength={watch("description")?.length || 0}
        error={errors.description?.message}
        className="min-h-[120px]"
        required
      />

      {/* 대분류 카테고리 선택 */}
      <FormField label="대분류 카테고리" description="클래스의 카테고리를 선택해주세요" required>
        <div className="flex flex-wrap gap-2">
          {LESSON_CATEGORIES.map((category) => (
            <SelectableBadge
              key={category.id}
              label={category.name}
              isSelected={selectedCategoryId === category.id}
              onClick={() => toggleCategory(category.id)}
              size="md"
            />
          ))}
        </div>
        {errors.classCategoryId && <p className="text-xs text-red-500 mt-1">{errors.classCategoryId.message}</p>}
      </FormField>

      {/* 소분류 카테고리 선택 */}
      {selectedCategoryId > 0 && availableSubCategories.length > 0 && (
        <FormField label="소분류 카테고리" description="클래스의 소분류 카테고리를 선택해주세요 (복수 선택 가능)" required>
          <div className="flex flex-wrap gap-2">
            {availableSubCategories.map((subCategory) => (
              <SelectableBadge
                key={subCategory.id}
                label={subCategory.name}
                isSelected={selectedSubCategoryIds.includes(subCategory.id)}
                onClick={() => toggleSubCategory(subCategory.id)}
                size="md"
              />
            ))}
          </div>
          {errors.subCategoryIds && <p className="text-xs text-red-500 mt-1">{errors.subCategoryIds.message}</p>}
        </FormField>
      )}

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
        register={register("curriculum")}
        placeholder="클래스에서 배울 내용을 구체적으로 작성해주세요 (40~600자)"
        maxLength={600}
        minLength={40}
        currentLength={watch("curriculum")?.length || 0}
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
                "p-4 rounded-lg border-2 transition-all text-left",
                selectedLevel === option.value
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <div className="font-bold text-sm">{option.label}</div>
              <div className="text-xs text-gray-500 mt-1">{option.description}</div>
            </button>
          ))}
        </div>
        {errors.level && <p className="text-xs text-red-500 mt-1">{errors.level.message}</p>}
      </FormField>

      {/* 소요 시간 */}
      <FormField label="소요 시간" description={`${durationMin}분 (${Math.floor(durationMin / 60)}시간 ${durationMin % 60}분)`} required>
        <Controller
          name="durationMin"
          control={control}
          render={({ field }) => (
            <Slider
              min={30}
              max={400}
              step={30}
              value={[field.value]}
              onValueChange={(value) => field.onChange(value[0])}
              className="w-full"
            />
          )}
        />
        {errors.durationMin && <p className="text-xs text-red-500 mt-1">{errors.durationMin.message}</p>}
      </FormField>

      {/* 가격 및 할인 */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            id="price"
            label="가격"
            register={register("price", { valueAsNumber: true })}
            placeholder="0"
            suffix="원"
            error={errors.price?.message}
            required
          />
          <FormInput
            id="discountRate"
            label="할인율"
            register={register("discountRate", { valueAsNumber: true })}
            placeholder="0"
            suffix="%"
            error={errors.discountRate?.message}
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
        {errors.maxParticipants && <p className="text-xs text-red-500 mt-1">{errors.maxParticipants.message}</p>}
      </FormField>

      {/* 지역 선택 */}
      <FormField label="지역" description="클래스가 진행될 지역을 선택해주세요" required>
        <Controller
          name="regionId"
          control={control}
          render={({ field }) => (
            <RegionSelect
              value={field.value}
              onValueChange={field.onChange}
            />
          )}
        />
        {errors.regionId && <p className="text-xs text-red-500 mt-1">{errors.regionId.message}</p>}
      </FormField>

      {/* 클래스 장소 (카카오맵 검색) */}
      <FormField label="클래스 장소 (도로명 주소)" description="카카오맵에서 장소를 검색해주세요" required>
        <KakaoMapSearch
          onPlaceSelect={handlePlaceSelect}
          defaultValue={watch("address")}
        />
        {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>}
      </FormField>

      <FormInput
        id="detailAddress"
        label="상세 주소"
        register={register("detailAddress")}
        placeholder="상세 주소를 입력하세요 (선택)"
        error={errors.detailAddress?.message}
      />

      <FormTextarea
        id="directionsText"
        label="찾아오는 길"
        register={register("directionsText")}
        placeholder="클래스 장소를 찾아오는 방법을 설명해주세요 (선택)"
        error={errors.directionsText?.message}
        className="min-h-[80px]"
      />

      {/* 예약 가능 기간 */}
      <FormField label="예약 가능 기간" description={reservationLeadDays === 0 ? "당일 예약 가능" : `${reservationLeadDays}일 전부터 예약 가능`} required>
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
        {errors.reservationLeadDays && <p className="text-xs text-red-500 mt-1">{errors.reservationLeadDays.message}</p>}
      </FormField>
    </FormModal>
  );
}

export default CreateClassModal;
