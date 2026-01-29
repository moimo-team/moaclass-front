import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";

import { useLocation, useNavigate } from "react-router-dom";
import { useResetPasswordMutation, useVerifyResetCodeMutation } from "@/hooks/useAuthMutations";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";

// zod schema 정의
export const resetPasswordSchema = z
  .object({
    resetCode: z
      .string()
      .min(1, "인증코드를 입력해주세요."),
    newPassword: z
      .string()
      .min(8, "비밀번호는 최소 8자 이상이어야 합니다."),
    newPasswordConfirm: z
      .string()
      .min(8, "비밀번호는 최소 8자 이상이어야 합니다."),
    resetToken: z
      .string()
      .optional(),
  })
  .refine(
    (data) => data.newPassword === data.newPasswordConfirm,
    {
      message: "비밀번호가 일치하지 않습니다.",
      path: ["newPasswordConfirm"],
    }
  );

// zod schema에서 추출한 타입
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const verifyResetCode = useVerifyResetCodeMutation();
  const { mutate: resetPassword, isPending } = useResetPasswordMutation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { email } = state || {};

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // 인증확인
  const handleVerify = async () => {
    const resetCode = getValues("resetCode");

    // 인증코드 유효성 검사
    if (!resetCode) {
      setError("resetCode", {
        type: "manual",
        message: "인증코드를 입력해주세요."
      });
      return;
    }

    // 인증코드 형식이 올바르면 react-hook-form 에러 클리어
    clearErrors("resetCode");

    // 인증코드 확인
    try {
      const verifyInfo = await verifyResetCode.mutateAsync({
        email,
        code: resetCode,
      });

      // resetToken을 form에 저장
      setValue("resetToken", verifyInfo.resetToken);

    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 400) {
        setError("resetCode", { message: "유효하지 않은 인증코드입니다." });
        return;
      }
      if (axiosError.response?.status === 410) {
        setError("resetCode", { message: "인증코드가 만료되었습니다." });
        return;
      }
      console.error("인증코드 확인 중 오류 발생: ", error);
    }
  }


  const onSubmit = (data: ResetPasswordFormValues) => {
    // 인증코드 확인이 성공했는지 체크
    if (!data.resetToken) {
      setError("resetCode", { message: "먼저 인증확인을 완료해주세요." });
      return;
    }

    // data를 그대로 전달 (resetToken이 이미 포함되어 있음)
    resetPassword(
      data,
      {
        onSuccess: () => {
          toast.success("비밀번호 변경이 완료되었습니다.");
          navigate("/login");
        },
        onError: (error: AxiosError) => {
          if (error.response?.status === 400) {
            setError("resetCode", { message: "인증코드가 유효하지 않거나 만료되었습니다." });
            return;
          }
          setError(
            "root",
            {
              type: "manual",
              message: "비밀번호 변경에 실패했습니다.",
            }
          );
        }
      }
    );
  };

  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center bg-transparent p-4">
      <Card className="w-full max-w-[440px] p-8 shadow-lg border-none bg-login-form rounded-[12px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-foreground mb-2">비밀번호 재설정</CardTitle>
          <CardDescription className="text-center">인증코드와 새로운 비밀번호를 입력해주세요</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-8 p-0">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              {/* 인증코드 입력 섹션 */}
              <div className="grid gap-2">
                <Label
                  htmlFor="resetCode"
                  className="text-sm font-medium text-muted-foreground mr-auto"
                >
                  인증코드
                </Label>
                <div className="flex gap-2">
                  <Input
                    {...register("resetCode", {
                      onChange: () => {
                        setValue("resetToken", "");
                        verifyResetCode.reset();
                      }
                    })}
                    type="text"
                    placeholder="인증코드"
                    className="h-12 border-input focus-visible:ring-primary flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleVerify}
                    disabled={verifyResetCode.isPending}
                    className="h-12 px-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-[8px] transition-colors shadow-none border-none shrink-0"
                  >
                    {verifyResetCode.isPending ? "확인 중..." : "인증확인"}
                  </Button>
                </div>
                {errors.resetCode ? (
                  <p className="text-sm text-destructive">{errors.resetCode.message}</p>
                ) : verifyResetCode.isSuccess ? (
                  <p className="text-sm text-success">
                    {"인증코드 확인이 완료되었습니다."}
                  </p>
                ) : null}
              </div>
              {/* 새로운 비밀번호 입력 섹션 */}
              <div className="grid gap-2">
                <Label
                  htmlFor="newPassword"
                  className="text-sm font-medium text-muted-foreground mr-auto"
                >
                  새로운 비밀번호
                </Label>
                <Input
                  {...register("newPassword")}
                  type="password"
                  placeholder="새로운 비밀번호"
                  className="h-12 border-input focus-visible:ring-primary flex-1"
                />
                {errors.newPassword && <p className="text-sm text-destructive">{errors.newPassword.message}</p>}
              </div>
              {/* 새로운 비밀번호 확인 입력 섹션 */}
              <div className="grid gap-2">
                <Label
                  htmlFor="newPasswordConfirm"
                  className="text-sm font-medium text-muted-foreground mr-auto"
                >
                  새로운 비밀번호 확인
                </Label>
                <Input
                  {...register("newPasswordConfirm")}
                  type="password"
                  placeholder="새로운 비밀번호 확인"
                  className="h-12 border-input focus-visible:ring-primary flex-1"
                />
                {errors.newPasswordConfirm && <p className="text-sm text-destructive">{errors.newPasswordConfirm.message}</p>}
              </div>

              {/* 비밀번호 변경하기 버튼 */}
              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-14 mt-2 text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-md border-none"
              >
                {isPending ? "변경 중..." : "비밀번호 변경하기"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ResetPassword;