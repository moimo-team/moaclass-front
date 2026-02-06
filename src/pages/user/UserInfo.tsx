import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RegionSelect } from "@/components/common/RegionSelect";
import { useNavigate } from "react-router-dom";
import { useCategoryQuery } from "@/hooks/useCategoryQuery";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserUpdateMutation } from "@/hooks/useUserInfoMutations";
import { Textarea } from "@/components/ui/textarea";
import { SelectableBadge } from "@/components/common/SelectableBadge";

// zod schema 정의
const userInfoSchema = z.object({
  bio: z.string().min(1, "자기소개를 입력해주세요.")
    .max(100, "자기소개는 100자 이내로 입력해주세요."),
  regionId: z.number().min(1, "지역을 선택해주세요."),
  interests: z.array(z.number()).min(3, "관심사를 3개 이상 선택해주세요."),
});

export type UserInfoFormValues = z.infer<typeof userInfoSchema>;

const UserInfo = () => {
  const navigate = useNavigate();
  const { data: interests } = useCategoryQuery();
  const userUpdateMutation = useUserUpdateMutation();

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<UserInfoFormValues>({
    resolver: zodResolver(userInfoSchema),
    mode: "onChange",
    defaultValues: {
      bio: "",
      regionId: 0,
      interests: [],
    }
  });

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

  const onSubmit = async (data: UserInfoFormValues) => {
    try {
      const formData = new FormData();
      formData.append("bio", data.bio);
      formData.append("regionId", data.regionId.toString());
      formData.append("interests", JSON.stringify(data.interests));

      await userUpdateMutation.mutateAsync(formData);
      toast.success("프로필 등록이 완료되었습니다.");
      navigate("/");
    } catch (error) {
      setError("root",
        {
          type: "manual",
          message: "프로필 등록에 실패했습니다"
        }
      );
    }
  };

  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center bg-transparent p-4">
      <Card className="w-full max-w-[500px] p-8 shadow-lg border-none bg-login-form rounded-[12px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-foreground mb-2">프로필 등록하기</CardTitle>
          <CardDescription className="text-center">
            프로필을 등록하여 모아클과 친해져요
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-8 p-0">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            {/* 자기소개 입력 섹션 */}
            <div className="grid gap-2">
              <Label
                htmlFor="bio"
                className="text-sm font-medium text-muted-foreground mr-auto"
              >
                자기소개
              </Label>
              <Textarea
                id="bio"
                {...register("bio")}
                placeholder="자기소개를 입력해주세요"
                className="h-12 border-input focus-visible:ring-primary min-h-[100px] py-3 bg-card"
              />
              {errors.bio && <p className="text-sm text-destructive">{errors.bio.message}</p>}
            </div>
            {/* 지역 선택 섹션 */}
            <div className="grid gap-2">
              <Label
                htmlFor="region"
                className="text-sm font-medium text-muted-foreground mr-auto"
              >
                지역을 선택해 주세요
              </Label>
              <RegionSelect
                value={watch("regionId")}
                onValueChange={(value) => setValue("regionId", value as number, { shouldValidate: true })}
                valueType="id"
              />
              {errors.regionId && <p className="text-sm text-destructive">{errors.regionId.message}</p>}
            </div>

            {/* 카테고리 선택 섹션 */}
            <div className="grid gap-2">
              <Label
                className="text-sm font-medium text-muted-foreground mr-auto"
              >
                카테고리 (3개 이상 선택해주세요)
              </Label>
              <div className="grid grid-cols-4 gap-3">
                {interests?.map((interest) => (
                  <SelectableBadge
                    key={interest.id}
                    label={interest.name}
                    isSelected={selectedInterests.includes(interest.id)}
                    onClick={() => toggleInterest(interest.id)}
                    variant="card"
                  />
                ))}
              </div>
              {errors.interests && <p className="text-sm text-destructive">{errors.interests.message}</p>}
            </div>

            {/* 등록 버튼 */}
            <div className="flex flex-col gap-4 mt-2">
              <Button
                type="submit"
                disabled={!isValid}
                className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-md border-none disabled:bg-muted disabled:text-muted-foreground"
              >
                프로필 등록하기
              </Button>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
              >
                다음에 할래요
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserInfo;
