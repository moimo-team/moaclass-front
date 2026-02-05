import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useInterestQuery } from "@/hooks/useInterestQuery";
import { useUserUpdateMutation } from "@/hooks/useUserInfoMutations";
import { useUserInfoByIdQuery } from "@/hooks/useUserInfoQuery";
import type { Interest } from "@/models/interest.model";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import type { UserInfo } from "@/models/user.model";
import defaultProfile from "@/assets/images/profile.png";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { RegionSelect } from "../../map/RegionSelect";
import { REGIONS } from "@/constants/regions";
import { Controller } from "react-hook-form";
import { FormModal } from "@/components/features/modal/components/FormModal";
import { FormImageUpload } from "@/components/features/modal/components/FormImageUpload";
import { FormTextarea } from "@/components/features/modal/components/FormTextarea";

const profileSchema = z.object({
  nickname: z.string().min(2, "닉네임은 2자 이상 입력해주세요.").max(20, "닉네임은 20자 이내로 입력해주세요."),
  bio: z.string().max(100, "자기소개는 100자 이내로 입력해주세요."),
  regionId: z.number().min(1, "지역을 선택해주세요."),
  interests: z.array(z.number()).min(3, "관심사를 3개 이상 선택해주세요!"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userInfo?: UserInfo;
  userId?: number;
  readOnly?: boolean;
}

const ProfileSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="flex flex-col items-center gap-4 py-4">
      <Skeleton className="w-32 h-32 rounded-full" />
      <Skeleton className="h-7 w-28" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-5 w-16" />
      <Skeleton className="h-24 w-full" />
    </div>
    <div className="space-y-3">
      <Skeleton className="h-5 w-16" />
      <div className="grid grid-cols-4 gap-2">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  </div>
);

const UserProfileModal = ({ isOpen, onClose, userInfo, userId, readOnly }: ProfileModalProps) => {
  const { data: allInterests } = useInterestQuery();
  const { data: fetchedUser, isLoading: isUserLoading } = useUserInfoByIdQuery(userId || 0);
  const userUpdateMutation = useUserUpdateMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isEditingNickname, setIsEditingNickname] = useState(false);

  // 우선순위: fetch된 데이터 > props로 전달된 데이터
  const displayUserInfo = fetchedUser || userInfo;
  const isReadOnly = readOnly;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors, isValid }
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      nickname: "",
      bio: "",
      regionId: 0,
      interests: [],
    }
  });

  useEffect(() => {
    if (displayUserInfo) {
      reset({
        nickname: displayUserInfo.nickname || "",
        bio: displayUserInfo.bio || "",
        regionId: displayUserInfo.regionId || 0,
        interests: displayUserInfo.categories?.map((i: Interest) => i.id) || [],
      });
      const img = displayUserInfo.profileImage || defaultProfile;
      setPreviewImage(img);
    }
  }, [displayUserInfo, reset, isOpen]);

  const selectedInterests = watch("interests");

  const toggleInterest = (interestId: number) => {
    const currentInterests = [...selectedInterests];
    const index = currentInterests.indexOf(interestId);

    if (index > -1) {
      currentInterests.splice(index, 1);
    } else {
      currentInterests.push(interestId);
    }

    setValue("interests", currentInterests, { shouldValidate: true });
  };

  const handleImageChange = (dataUrl: string) => {
    setPreviewImage(dataUrl);
  };

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      const formData = new FormData();
      formData.append("nickname", data.nickname);
      formData.append("bio", data.bio);
      formData.append("regionId", data.regionId.toString());
      formData.append("interests", JSON.stringify(data.interests));

      if (fileInputRef.current?.files?.[0]) {
        formData.append("file", fileInputRef.current.files[0]);
      }

      await userUpdateMutation.mutateAsync(formData);
      toast.success("프로필 수정이 완료되었습니다.");
      onClose();
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("프로필 수정에 실패했습니다.");
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={!isReadOnly ? handleSubmit(onSubmit) : undefined}
      title={isReadOnly ? "프로필 정보" : "프로필을 수정해주세요"}
      submitButtonText="프로필 수정하기"
      isSubmitDisabled={!isValid || userUpdateMutation.isPending}
      isLoading={isUserLoading && !!userId}
      loadingComponent={<ProfileSkeleton />}
      showFooter={!isReadOnly}
      containerClassName={isReadOnly ? "max-w-md" : "max-w-xl"}
    >
      {/* 프로필 이미지 */}
      <div className="flex flex-col items-center gap-4 py-4">
        <FormImageUpload
          ref={fileInputRef}
          variant="profile"
          previewImage={previewImage || defaultProfile}
          onImageChange={handleImageChange}
          readOnly={isReadOnly}
        />
        <div className="flex flex-col items-center w-full">
          {isEditingNickname && !isReadOnly ? (
            <div className="w-full max-w-[200px] space-y-1">
              <Input
                {...register("nickname")}
                autoFocus
                onBlur={() => setIsEditingNickname(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    setIsEditingNickname(false);
                  }
                  if (e.key === "Escape") {
                    setValue("nickname", displayUserInfo?.nickname || "");
                    setIsEditingNickname(false);
                  }
                }}
                className="text-center h-8 text-lg font-bold"
              />
              {errors.nickname && (
                <p className="text-[10px] text-red-500 text-center">{errors.nickname.message}</p>
              )}
            </div>
          ) : (
            <div
              className={cn(
                "flex items-center gap-2 justify-center",
                !isReadOnly && "cursor-pointer group"
              )}
              onDoubleClick={() => !isReadOnly && setIsEditingNickname(true)}
              title={!isReadOnly ? "더블클릭하여 수정" : undefined}
            >
              <h2 className={cn(
                "text-xl font-bold text-gray-900",
                !isReadOnly && "group-hover:text-yellow-500 transition-colors"
              )}>
                {watch("nickname") || displayUserInfo?.nickname || "사용자"}
              </h2>
              {!isReadOnly && (
                <Pencil className="w-4 h-4 text-gray-400 group-hover:text-yellow-500 transition-colors" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* 자기소개 */}
      {!isReadOnly ? (
        <FormTextarea
          id="bio"
          label="자기소개"
          register={register("bio")}
          placeholder="본인을 소개해주세요."
          maxLength={100}
          currentLength={watch("bio")?.length || 0}
          error={errors.bio?.message}
          className="min-h-[100px]"
        />
      ) : (
        <div className="space-y-2">
          <Label htmlFor="bio" className="text-sm font-bold text-gray-700">자기소개</Label>
          <div className="min-h-[100px] bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm text-gray-700">
            {watch("bio") || "등록된 자기소개가 없습니다."}
          </div>
        </div>
      )}

      {/* 지역 */}
      <div className="space-y-2">
        <Label htmlFor="regionId" className="text-sm font-bold text-gray-700">지역</Label>
        {isReadOnly ? (
          <div className="w-50 bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm text-gray-700">
            {REGIONS.find(r => r.id === watch("regionId"))?.name || "지역 정보 없음"}
          </div>
        ) : (
          <Controller
            name="regionId"
            control={control}
            render={({ field }) => (
              <RegionSelect
                onValueChange={field.onChange}
                value={field.value}
              />
            )}
          />
        )}
        {!isReadOnly && errors.regionId && <p className="text-xs text-red-500 mt-1">{errors.regionId.message}</p>}
      </div>

      {/* 카테고리 */}
      <div className="space-y-3">
        <div className="space-y-1">
          <Label className="text-sm font-bold text-gray-700">카테고리</Label>
          {!isReadOnly && <p className="text-[10px] text-gray-400 block">최소 3개이상 선택해주세요!</p>}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {isReadOnly && selectedInterests.length === 0 ? (
            <p className="text-sm text-gray-400 col-span-4 py-2">선택한 카테고리가 없습니다.</p>
          ) : (
            allInterests?.map((interest) => (
              <button
                key={interest.id}
                type="button"
                onClick={() => !isReadOnly && toggleInterest(interest.id)}
                disabled={isReadOnly && !selectedInterests.includes(interest.id)}
                className={cn(
                  "h-10 text-xs font-medium rounded-lg transition-all border shadow-sm",
                  selectedInterests.includes(interest.id)
                    ? "bg-yellow-400 border-yellow-400 text-gray-900 shadow-md hover:bg-yellow-500"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400",
                  isReadOnly && !selectedInterests.includes(interest.id) && "hidden"
                )}
              >
                {interest.name}
              </button>
            ))
          )}
        </div>
        {!isReadOnly && errors.interests && <p className="text-xs text-red-500 mt-1">{errors.interests.message}</p>}
      </div>
    </FormModal>
  );
};

export default UserProfileModal;
