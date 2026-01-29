import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useInterestQuery } from "@/hooks/useInterestQuery";
import { useUserUpdateMutation } from "@/hooks/useUserInfoMutations";
import { useAuthQuery } from "@/hooks/useAuthQuery";
import { useUserInfoByIdQuery } from "@/hooks/useUserInfoQuery";
import type { Interest } from "@/models/interest.model";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Pencil } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import type { UserInfo } from "@/models/user.model";
import defaultProfile from "@/assets/images/profile.png";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const profileSchema = z.object({
  nickname: z.string().min(2, "닉네임은 2자 이상 입력해주세요.").max(20, "닉네임은 20자 이내로 입력해주세요."),
  bio: z.string().max(100, "자기소개는 100자 이내로 입력해주세요."),
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

const ProfileModal = ({ isOpen, onClose, userInfo, userId, readOnly }: ProfileModalProps) => {
  const { data: currentUser } = useAuthQuery();
  const { data: allInterests } = useInterestQuery();
  const { data: fetchedUser, isLoading: isUserLoading } = useUserInfoByIdQuery(userId || 0);
  const userUpdateMutation = useUserUpdateMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isEditingNickname, setIsEditingNickname] = useState(false);

  // 우선순위: fetch된 데이터 > props로 전달된 데이터
  const displayUserInfo = fetchedUser || userInfo;

  // userInfo.id (User) 또는 userInfo.userId (Participant) 또는 userId 대응
  const targetUserId = userId || displayUserInfo?.id || displayUserInfo?.userId;
  const isReadOnly = readOnly ?? (targetUserId !== undefined && currentUser?.id !== undefined ? targetUserId !== currentUser.id : true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid }
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      nickname: "",
      bio: "",
      interests: [],
    }
  });

  useEffect(() => {
    if (displayUserInfo) {
      reset({
        nickname: displayUserInfo.nickname || "",
        bio: displayUserInfo.bio || "",
        interests: displayUserInfo.interests?.map((i: Interest) => i.id) || [],
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      const formData = new FormData();
      formData.append("nickname", data.nickname);
      formData.append("bio", data.bio);
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "p-0 bg-white rounded-2xl flex flex-col max-h-[90vh]",
        isReadOnly ? "max-w-md" : "max-w-xl"
      )}>
        {/* Fixed Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-bold text-center text-[#1A2B4B]">
            {isReadOnly ? "프로필 정보" : "프로필을 수정해주세요"}
          </DialogTitle>
        </DialogHeader>

        {isUserLoading && userId ? (
          <div className="px-6 py-6"><ProfileSkeleton /></div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {/* Profile Image Section */}
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <Camera className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <Camera className="w-5 h-5 text-gray-600" />
                    </button>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                    name="profileImage"
                  />
                </div>
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
                        {isUserLoading ? (
                          <Skeleton className="h-7 w-28" />
                        ) : (
                          watch("nickname") || displayUserInfo?.nickname || "사용자"
                        )}
                      </h2>
                      {!isReadOnly && (
                        <Pencil className="w-4 h-4 text-gray-400 group-hover:text-yellow-500 transition-colors" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Bio Section */}
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-bold text-gray-700">자기소개</Label>
                <Textarea
                  id="bio"
                  {...register("bio")}
                  placeholder={isReadOnly ? "등록된 자기소개가 없습니다." : "본인을 소개해주세요."}
                  readOnly={isReadOnly}
                  className={cn(
                    "min-h-[100px] bg-white border-gray-200 rounded-lg resize-none focus-visible:ring-yellow-400 text-sm",
                    isReadOnly && "focus-visible:ring-0 border-gray-100"
                  )}
                />
                {!isReadOnly && errors.bio && <p className="text-xs text-red-500 mt-1">{errors.bio.message}</p>}
              </div>

              {/* Interests Section */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-sm font-bold text-gray-700">관심사</Label>
                  {!isReadOnly && <p className="text-[10px] text-gray-400 text-center block">최소 3개이상 선택해주세요!</p>}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {isReadOnly && selectedInterests.length === 0 ? (
                    <p className="text-sm text-gray-400 col-span-4 py-2">선택한 관심사가 없습니다.</p>
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
            </div>

            {/* Fixed Submit Button */}
            {!isReadOnly && (
              <div className="px-6 py-4 border-t">
                <Button
                  type="submit"
                  disabled={!isValid || userUpdateMutation.isPending}
                  className="w-full h-12 bg-yellow-400 hover:bg-yellow-500 text-white font-bold rounded-lg shadow-sm disabled:bg-gray-200 disabled:text-gray-400 border-none"
                >
                  {userUpdateMutation.isPending ? "수정 중..." : "프로필 수정하기"}
                </Button>
              </div>
            )}
          </form>
        )}
      </DialogContent>
    </Dialog >
  );
};

export default ProfileModal;
