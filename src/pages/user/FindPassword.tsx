import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useNavigate } from "react-router-dom";
import { useFindPasswordMutation } from "@/hooks/useAuthMutations";
import { toast } from "sonner";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";

// zod schema 정의
export const findPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요.")
    .email("이메일 형식이 올바르지 않습니다."),
});

// zod schema에서 추출한 타입
export type FindPasswordFormValues = z.infer<typeof findPasswordSchema>;

const FindPassword = () => {
  const { mutate: findPassword, isPending } = useFindPasswordMutation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FindPasswordFormValues>({
    resolver: zodResolver(findPasswordSchema),
    defaultValues: {
      email: ""
    }
  });

  const onSubmit = (data: FindPasswordFormValues) => {
    findPassword(data, {
      onSuccess: () => {
        toast.success("이메일로 인증코드가 전송되었습니다.");
        navigate("/reset-password", { state: { email: data.email } });
      },
      onError: (error: AxiosError) => {
        if (error.response?.status === 404) {
          setError("email", { message: "일치하는 이메일을 찾을 수 없습니다." });
          return;
        }
        setError("root", { type: "manual", message: "이메일 전송에 실패했습니다." });
      }
    });
  };

  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center bg-transparent p-4">
      <Card className="w-full max-w-[440px] p-8 shadow-lg border-none bg-login-form rounded-[12px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-foreground mb-2">비밀번호 찾기</CardTitle>
          <CardDescription className="text-center">가입한 이메일을 입력해주세요</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-8 p-0">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              {/* 이메일 입력 섹션 */}
              <div className="grid gap-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-muted-foreground mr-auto"
                >
                  이메일
                </Label>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="moimo@email.com"
                  className="h-12 border-input focus-visible:ring-primary flex-1"
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>
              {/* 인증코드 전송 버튼 */}
              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-14 mt-2 text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-md border-none"
              >
                {isPending ? "전송 중..." : "인증코드 전송"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default FindPassword;