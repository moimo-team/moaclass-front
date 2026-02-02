import { Button } from "@/components/ui/button";
import { SiKakaotalk, SiNaver } from "react-icons/si";
import { FcGoogle } from "react-icons/fc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useGoogleLoginMutation, useLoginMutation } from "@/hooks/useAuthMutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";
// import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLogin, type CodeResponse } from "@react-oauth/google";
import { toast } from "sonner";

// zod schema 정의
export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "이메일을 입력해주세요.")
        .email("이메일 형식이 올바르지 않습니다."),
    password: z
        .string()
        .min(1, "비밀번호를 입력해주세요.")
        .min(8, "비밀번호는 최소 8자 이상이어야 합니다."),
});

// zod schema에서 추출한 타입
export type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
    const { mutateAsync: loginMutation, isPending } = useLoginMutation();
    const googleLoginMutation = useGoogleLoginMutation();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            const loginInfo = await loginMutation(data);

            if (loginInfo.user.isNewUser) {
                navigate("/user-info", {
                    state: {
                        accessToken: loginInfo.accessToken,
                        user: loginInfo.user
                    }
                });
            } else {
                navigate("/");
            }
        } catch (error: any) {
            setError("root",
                {
                    type: "manual",
                    message: "로그인에 실패했습니다"
                }
            );
        }
    };

    // 구글 로그인(Authorization Code Flow 방식)
    const handleGoogleCodeSuccess = async (codeResponse: CodeResponse) => {
        try {
            // codeResponse.code가 Authorization Code
            const loginInfo = await googleLoginMutation.mutateAsync({
                code: codeResponse.code,
                redirectUri: 'postmessage' // Auth Code 방식에서는 'postmessage' 고정
            });

            if (loginInfo.user.isNewUser) {
                navigate("/user-info", {
                    state: {
                        accessToken: loginInfo.accessToken,
                        user: loginInfo.user
                    }
                });
            } else {
                navigate("/");
            }
        } catch (error) {
            console.error(error);
            setError("root", { type: "manual", message: "Google 로그인에 실패했습니다." });
        }
    };

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: handleGoogleCodeSuccess,
        onError: () => setError("root", { type: "manual", message: "Google 로그인에 실패했습니다." }),
        flow: 'auth-code',
    });

    return (
        <div className="flex flex-1 w-full flex-col items-center justify-center bg-transparent p-4">
            <Card className="w-full max-w-[330px] p-8 shadow-lg border-none bg-login-form rounded-[12px]">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center text-foreground mb-2">모아클 로그인</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-8 p-0">
                    {/* 추후 제거 예정 */}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-6">
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
                                    className="h-12 border-input focus-visible:ring-primary"
                                />
                                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                            </div>
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
                                    placeholder="비밀번호를 입력하세요"
                                    className="h-12 border-input focus-visible:ring-primary"
                                />
                                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                            </div>
                            {errors.root && <p className="text-sm text-destructive">{errors.root.message}</p>}
                            <Button
                                className="w-full h-12 mt-2 text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-sm border-none"
                                disabled={isPending}
                            >
                                {isPending ? "로딩 중..." : "로그인"}
                            </Button>
                        </div>
                    </form>


                    <div className="flex justify-center items-center gap-4 text-xs text-muted-foreground">
                        <Link to="/join" className="hover:underline">회원가입</Link>
                        <Separator orientation="vertical" className="h-3" />
                        <Link to="/find-password" className="hover:underline">비밀번호 찾기</Link>
                    </div>

                    <div className="flex flex-col gap-4 pt-4">
                        {/* 구글 로그인 버튼 - 가로 전체 너비 */}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleGoogleLogin()}
                            className="w-full h-12 flex items-center justify-center gap-2 bg-white text-foreground hover:bg-gray-50 border-input shadow-sm"
                        >
                            <FcGoogle size={24} />
                            <span className="text-sm font-medium">Google 계정으로 로그인</span>
                        </Button>

                        {/* 카카오 로그인 버튼 - 가로 전체 너비 */}
                        <Button
                            type="button"
                            onClick={() => toast.error("준비 중인 서비스입니다.")}
                            className="w-full h-12 flex items-center justify-center gap-2 bg-[#FEE500] text-[#191919] hover:bg-[#FEE500]/90 border-none shadow-sm"
                        >
                            <SiKakaotalk size={20} />
                            <span className="text-sm font-semibold">Kakao 계정으로 로그인</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;