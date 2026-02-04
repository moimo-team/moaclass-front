import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import type { TeacherProfile } from "@/models/lesson.model";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { FormModal } from "@/components/features/modal/components/FormModal";
import { FormImageUpload } from "@/components/features/modal/components/FormImageUpload";
import { FormInput } from "@/components/features/modal/components/FormInput";
import { FormTextarea } from "@/components/features/modal/components/FormTextarea";

const teacherProfileSchema = z.object({
  nickname: z.string().min(2, "활동명은 2자 이상 입력해주세요.").max(30, "활동명은 30자 이내로 입력해주세요."),
  introduction: z.string().min(40, "소개는 40자 이상 입력해주세요.").max(600, "소개는 600자 이내로 입력해주세요."),
});

type TeacherProfileFormValues = z.infer<typeof teacherProfileSchema>;

interface TeacherProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: TeacherProfile) => void;
  profile: TeacherProfile | null;
}

const ProfileSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="flex flex-col items-center gap-4 py-4">
      <Skeleton className="w-32 h-32 rounded-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-10 w-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-5 w-16" />
      <Skeleton className="h-48 w-full" />
    </div>
  </div>
);

export const TeacherProfileModal = ({
  isOpen,
  onClose,
  onSave,
  profile,
}: TeacherProfileModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid }
  } = useForm<TeacherProfileFormValues>({
    resolver: zodResolver(teacherProfileSchema),
    mode: "onChange",
    defaultValues: {
      nickname: "",
      introduction: "",
    }
  });

  useEffect(() => {
    if (profile) {
      reset({
        nickname: profile.nickname,
        introduction: profile.introduction,
      });
      setPreviewImage(profile.image);
    } else {
      reset({
        nickname: "",
        introduction: "",
      });
      setPreviewImage(null);
    }
  }, [profile, reset, isOpen]);

  const handleImageChange = (dataUrl: string) => {
    setPreviewImage(dataUrl);
  };

  const onSubmit = async (data: TeacherProfileFormValues) => {
    // 이미지 검증
    if (!previewImage) {
      // *TODO: 이미지도 zod로 관리
      toast.error("모멘토 프로필 사진을 등록해주세요.");
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("nickname", data.nickname);
      formData.append("introduction", data.introduction);

      if (fileInputRef.current?.files?.[0]) {
        formData.append("file", fileInputRef.current.files[0]);
      }

      // TODO: 실제 API 호출
      // await teacherProfileMutation.mutateAsync(formData);

      // 임시: Mock 데이터 생성
      const newProfile: TeacherProfile = {
        id: profile?.id || Date.now(),
        userId: 1,
        nickname: data.nickname,
        image: previewImage,
        introduction: data.introduction,
        createdAt: profile?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onSave(newProfile);
      toast.success(profile ? "프로필이 수정되었습니다." : "프로필이 등록되었습니다.");
      onClose();
    } catch (error) {
      console.error("Profile save failed:", error);
      toast.error("프로필 저장에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      title={profile ? "모멘토 프로필 수정" : "모멘토 프로필 등록"}
      submitButtonText={profile ? "프로필 수정하기" : "프로필 등록하기"}
      isSubmitDisabled={!isValid || !previewImage}
      isLoading={isLoading}
      loadingComponent={<ProfileSkeleton />}
    >
      {/* 프로필 이미지 */}
      <div className="flex flex-col items-center gap-4 py-4">
        <FormImageUpload
          ref={fileInputRef}
          variant="profile"
          previewImage={previewImage || ""}
          onImageChange={handleImageChange}
        />
      </div>

      {/* 활동명/상호명 */}
      <FormInput
        id="nickname"
        label="활동명 / 상호명"
        register={register("nickname")}
        placeholder="모멘토님의 활동명을 입력하세요 (2~30자)"
        required
        maxLength={30}
        currentLength={watch("nickname")?.length || 0}
        error={errors.nickname?.message}
      />

      {/* 소개글 */}
      <FormTextarea
        id="introduction"
        label="소개"
        register={register("introduction")}
        placeholder="모멘토님의 소개를 입력하세요 (40~600자)"
        required
        maxLength={600}
        minLength={40}
        currentLength={watch("introduction")?.length || 0}
        error={errors.introduction?.message}
      />
    </FormModal>
  );
};
