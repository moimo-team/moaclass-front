import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEmailCheckMutation, useJoinMutation, useNicknameCheckMutation } from "@/hooks/useAuthMutations";

// zod schema 정의
export const joinSchema = z
  .object({
    email: z
      .string()
      .min(1, "이메일을 입력해주세요.")
      .email("이메일 형식이 올바르지 않습니다."),
    nickname: z
      .string()
      .min(1, "닉네임을 입력해주세요."),
    password: z
      .string()
      .min(1, "비밀번호를 입력해주세요.")
      .min(8, "비밀번호는 최소 8자 이상이어야 합니다."),
    passwordConfirm: z
      .string()
      .min(1, "비밀번호를 입력해주세요.")
      .min(8, "비밀번호는 최소 8자 이상이어야 합니다."),
  })
  .refine(
    (data) => data.password === data.passwordConfirm,
    {
      message: "비밀번호가 일치하지 않습니다.",
      path: ["passwordConfirm"],
    }
  );

// zod schema에서 추출한 타입
export type JoinFormValues = z.infer<typeof joinSchema>;

const Join = () => {
  const { mutateAsync: joinMutation, isPending } = useJoinMutation();
  const emailCheckMutation = useEmailCheckMutation();
  const nicknameCheckMutation = useNicknameCheckMutation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    getValues,
    formState: { errors }
  } = useForm<JoinFormValues>({
    resolver: zodResolver(joinSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
    }
  });

  const onSubmit = async (data: JoinFormValues) => {
    // 이메일 중복 확인 여부 체크
    if (!emailCheckMutation.isSuccess) {
      toast.error("이메일 중복 확인을 해주세요.");
      return;
    }

    // 닉네임 중복 확인 여부 체크
    if (!nicknameCheckMutation.isSuccess) {
      toast.error("닉네임 중복 확인을 해주세요.");
      return;
    }

    try {
      const joinInfo = await joinMutation(data);
      const { /* id, email, */ nickname } = joinInfo.user;
      toast.success("회원가입이 완료되었습니다.");
      navigate("/user-info", { state: { /* id, email, */ nickname } });
    } catch (error) {
      console.error("회원가입 중 오류 발생: ", error);
      setError("root", {
        type: "manual",
        message: "회원가입에 실패했습니다."
      });
    }
  };

  // 이메일 중복 확인
  const handleCheckEmail = async () => {
    const email = getValues("email");

    // 이메일 유효성 검사
    if (!email) {
      setError("email", {
        type: "manual",
        message: "이메일을 입력해주세요."
      });
      return;
    }

    // 이메일 형식 검사
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("email", {
        type: "manual",
        message: "이메일 형식이 올바르지 않습니다."
      });
      return;
    }

    // 이메일 형식이 올바르면 react-hook-form 에러 클리어
    clearErrors("email");

    try {
      await emailCheckMutation.mutateAsync(email)
    } catch (error) {
      // 에러는 mutation에서 자동으로 처리됨
    }
  }

  // 닉네임 중복 확인
  const handleCheckNickname = async () => {
    const nickname = getValues("nickname");

    // 닉네임 유효성 검사
    if (!nickname) {
      setError("nickname", {
        type: "manual",
        message: "닉네임을 입력해주세요."
      });
      return;
    }

    // 닉네임 형식이 올바르면 react-hook-form 에러 클리어
    clearErrors("nickname");

    try {
      await nicknameCheckMutation.mutateAsync(nickname)
    } catch (error) {
      // 에러는 mutation에서 자동으로 처리됨
    }
  }

  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center bg-transparent p-4">
      <Card className="w-full max-w-[440px] p-8 shadow-lg border-none bg-login-form rounded-[12px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-foreground mb-2">모이모 가입하기</CardTitle>
          <CardDescription className="text-center">새로운 계정을 만들어 모이모와 함께해요</CardDescription>
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
                <div className="flex gap-2">
                  <Input
                    {...register("email")}
                    type="email"
                    placeholder="moimo@email.com"
                    className="h-12 border-input focus-visible:ring-primary flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleCheckEmail}
                    disabled={emailCheckMutation.isPending}
                    className="h-12 px-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-[8px] transition-colors shadow-none border-none shrink-0"
                  >
                    {emailCheckMutation.isPending ? "확인중..." : "중복확인"}
                  </Button>
                </div>
                {/* errors.email: react-hook-form의 유효성 검사 에러 (필수 입력, 이메일 형식)
                                emailCheckMutation: 이메일 중복 확인 결과 (TanStack Query에서 관리) */}
                {errors.email ? (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                ) : emailCheckMutation.isError ? (
                  <p className="text-sm text-destructive">
                    {"이미 사용 중인 이메일입니다."}
                  </p>
                ) : emailCheckMutation.isSuccess ? (
                  <p className="text-sm text-success">
                    {"사용 가능한 이메일입니다."}
                  </p>
                ) : null}
              </div>
              {/* 닉네임 입력 섹션 */}
              <div className="grid gap-2">
                <Label
                  htmlFor="nickname"
                  className="text-sm font-medium text-muted-foreground mr-auto"
                >
                  닉네임
                </Label>
                <div className="flex gap-2">
                  <Input
                    {...register("nickname")}
                    type="nickname"
                    placeholder="노래하는햄스터"
                    className="h-12 border-input focus-visible:ring-primary flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleCheckNickname}
                    disabled={nicknameCheckMutation.isPending}
                    className="h-12 px-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-[8px] transition-colors shadow-none border-none shrink-0"
                  >
                    {nicknameCheckMutation.isPending ? "확인중..." : "중복확인"}
                  </Button>
                </div>
                {errors.nickname ? (
                  <p className="text-sm text-destructive">{errors.nickname.message}</p>
                ) : nicknameCheckMutation.isError ? (
                  <p className="text-sm text-destructive">
                    {"이미 사용 중인 닉네임입니다."}
                  </p>
                ) : nicknameCheckMutation.isSuccess ? (
                  <p className="text-sm text-success">
                    {"사용 가능한 닉네임입니다."}
                  </p>
                ) : null}
              </div>
              {/* 비밀번호 입력 섹션 */}
              <div className="grid gap-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-muted-foreground mr-auto"
                >
                  비밀번호
                </Label>
                <Input
                  {...register("password")}
                  type="password"
                  placeholder="8자 이상 입력"
                  className="h-12 border-input focus-visible:ring-primary"
                />
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>
              {/* 비밀번호 확인 섹션 */}
              <div className="grid gap-2">
                <Label
                  htmlFor="passwordConfirm"
                  className="text-sm font-medium text-muted-foreground mr-auto"
                >
                  비밀번호 확인
                </Label>
                <Input
                  {...register("passwordConfirm")}
                  type="password"
                  placeholder="8자 이상 입력"
                  className="h-12 border-input focus-visible:ring-primary"
                />
                {errors.passwordConfirm && (
                  <p className="text-sm text-destructive">
                    {errors.passwordConfirm.message}
                  </p>
                )}
              </div>
              {errors.root && <p className="text-sm text-destructive">{errors.root.message}</p>}
              {/* 회원가입 버튼 */}
              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-14 mt-2 text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-md border-none"
              >
                {isPending ? "가입 중..." : "회원가입하기"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Join;