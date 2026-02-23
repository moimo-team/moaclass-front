import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useGoogleLogin, type CodeResponse } from '@react-oauth/google';
import { Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import { SiKakaotalk } from 'react-icons/si';
import { Link, useNavigate } from 'react-router-dom';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
	useGoogleLoginMutation,
	useKakaoLoginMutation,
	useLoginMutation,
} from '@/hooks/useAuthMutations';
import { ENV } from '@/utils/env';

// import { GoogleLogin } from "@react-oauth/google";

// zod schema 정의
export const loginSchema = z.object({
	email: z.string().min(1, '이메일을 입력해주세요.').email('이메일 형식이 올바르지 않습니다.'),
	// password: z
	// 	.string()
	// 	.min(1, '비밀번호를 입력해주세요.')
	// 	.min(8, '비밀번호는 최소 8자 이상이어야 합니다.'),
});

// zod schema에서 추출한 타입
export type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
	const { mutateAsync: loginMutation, isPending } = useLoginMutation();
	const googleLoginMutation = useGoogleLoginMutation();
	const kakaoLoginMutation = useKakaoLoginMutation();
	const navigate = useNavigate();

	const [mode, setMode] = useState<'SELECT' | 'EMAIL'>('SELECT');

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
		},
	});

	const onSubmit = async (data: LoginFormValues) => {
		try {
			const loginInfo = await loginMutation(data);

			if (loginInfo.user.isNewUser) {
				navigate('/user-info', {
					state: {
						accessToken: loginInfo.accessToken,
						user: loginInfo.user,
					},
				});
			} else {
				navigate('/');
			}
		} catch {
			setError('root', {
				type: 'manual',
				message: '로그인에 실패했습니다',
			});
		}
	};

	// 구글 로그인(Authorization Code Flow 방식)
	const handleGoogleCodeSuccess = async (codeResponse: CodeResponse) => {
		try {
			// codeResponse.code가 Authorization Code
			const loginInfo = await googleLoginMutation.mutateAsync({
				code: codeResponse.code,
				redirectUri: 'postmessage', // Auth Code 방식에서는 'postmessage' 고정
			});

			if (loginInfo.user.isNewUser) {
				navigate('/user-info', {
					state: {
						accessToken: loginInfo.accessToken,
						user: loginInfo.user,
					},
				});
			} else {
				navigate('/');
			}
		} catch (error) {
			console.error(error);
			setError('root', { type: 'manual', message: 'Google 로그인에 실패했습니다.' });
		}
	};

	const handleGoogleLogin = useGoogleLogin({
		onSuccess: handleGoogleCodeSuccess,
		onError: () =>
			setError('root', { type: 'manual', message: 'Google 로그인에 실패했습니다.' }),
		flow: 'auth-code',
	});

	// 카카오 로그인(팝업 + postMessage 방식)
	const handleKakaoLogin = () => {
		const KAKAO_CLIENT_ID = ENV.KAKAO_CLIENT_ID;
		const KAKAO_REDIRECT_URI = ENV.KAKAO_REDIRECT_URI;

		// 카카오 인가 URL 생성
		const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;

		// 팝업 창을 화면 중앙에 배치하기 위한 좌표 계산
		const popupWidth = 500;
		const popupHeight = 600;
		const left = (window.screen.width - popupWidth) / 2;
		const top = (window.screen.height - popupHeight) / 2;

		// 팝업 창 열기
		const popup = window.open(
			kakaoAuthUrl,
			'kakaoLogin',
			`width=${popupWidth},height=${popupHeight},left=${left},top=${top},scrollbars=yes`,
		);

		// postMessage 이벤트 리스너 등록
		const handleMessage = async (event: MessageEvent) => {
			// 보안: origin 검증
			if (event.origin !== window.location.origin) return;

			if (event.data.type === 'KAKAO_LOGIN_SUCCESS') {
				const code = event.data.code;

				try {
					// 백엔드로 인가 코드 전달
					const loginInfo = await kakaoLoginMutation.mutateAsync({
						code,
						redirectUri: KAKAO_REDIRECT_URI,
					});

					if (loginInfo.user.isNewUser) {
						navigate('/user-info', {
							state: {
								accessToken: loginInfo.accessToken,
								user: loginInfo.user,
							},
						});
					} else {
						navigate('/');
					}
				} catch (error) {
					console.error(error);
					setError('root', { type: 'manual', message: 'Kakao 로그인에 실패했습니다.' });
				} finally {
					// 이벤트 리스너 제거
					window.removeEventListener('message', handleMessage);
				}
			} else if (event.data.type === 'KAKAO_LOGIN_ERROR') {
				setError('root', { type: 'manual', message: 'Kakao 로그인에 실패했습니다.' });
				window.removeEventListener('message', handleMessage);
			}
		};

		window.addEventListener('message', handleMessage);

		// 팝업이 닫혔을 때 리스너 정리
		const checkPopupClosed = setInterval(() => {
			if (popup?.closed) {
				clearInterval(checkPopupClosed);
				window.removeEventListener('message', handleMessage);
			}
		}, 500);
	};

	return (
		<div className="flex flex-1 w-full flex-col items-center justify-center bg-transparent p-4">
			<Card className="w-full max-w-[330px] p-8 shadow-lg border-none bg-login-form rounded-[12px]">
				<CardHeader>
					<CardTitle className="text-2xl font-bold text-center text-foreground mb-2">
						모아클 로그인
					</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col gap-8 p-0">
					{mode === 'EMAIL' ? (
						<>
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
											{...register('email')}
											type="email"
											placeholder="moimo@email.com"
											className="h-12 border-input focus-visible:ring-primary"
										/>
										{errors.email && (
											<p className="text-sm text-destructive">
												{errors.email.message}
											</p>
										)}
									</div>
									{/* <div className="grid gap-2">
										<Label
											htmlFor="password"
											className="text-sm font-medium text-muted-foreground mr-auto"
										>
											비밀번호
										</Label>
										<Input
											{...register('password')}
											type="password"
											placeholder="비밀번호를 입력하세요"
											className="h-12 border-input focus-visible:ring-primary"
										/>
										{errors.password && (
											<p className="text-sm text-destructive">
												{errors.password.message}
											</p>
										)}
									</div> */}
									{errors.root && (
										<p className="text-sm text-destructive">
											{errors.root.message}
										</p>
									)}
									<Button
										className="w-full h-12 mt-2 text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-sm border-none"
										disabled={isPending}
									>
										{isPending ? '로딩 중...' : '로그인'}
									</Button>
								</div>
							</form>

							<div className="flex flex-col gap-4">
								<div className="flex justify-center items-center gap-4 text-xs text-muted-foreground">
									<Link to="/join" className="hover:underline">
										회원가입
									</Link>
									<Separator orientation="vertical" className="h-3" />
									<Link to="/find-password" className="hover:underline">
										비밀번호 찾기
									</Link>
								</div>

								<Button
									type="button"
									variant="ghost"
									onClick={() => setMode('SELECT')}
									className="text-xs text-muted-foreground hover:bg-transparent hover:underline"
								>
									다른 방법으로 로그인
								</Button>
							</div>
						</>
					) : (
						<div className="flex flex-col gap-4">
							{/* 구글 로그인 버튼 */}
							<Button
								type="button"
								variant="outline"
								onClick={() => handleGoogleLogin()}
								className="w-full h-12 flex items-center justify-center gap-2 bg-white text-foreground hover:bg-gray-50 border-input shadow-sm"
							>
								<FcGoogle size={24} />
								<span className="text-sm font-medium">Google 계정으로 로그인</span>
							</Button>

							{/* 카카오 로그인 버튼 */}
							<Button
								type="button"
								onClick={() => handleKakaoLogin()}
								className="w-full h-12 flex items-center justify-center gap-2 bg-[#FEE500] text-[#191919] hover:bg-[#FEE500]/90 border-none shadow-sm"
							>
								<SiKakaotalk size={20} />
								<span className="text-sm font-semibold">Kakao 계정으로 로그인</span>
							</Button>

							{/* 이메일 로그인 버튼 */}
							<Button
								type="button"
								onClick={() => setMode('EMAIL')}
								className="w-full h-12 flex items-center justify-center gap-2"
							>
								<Mail size={20} />
								<span className="text-sm font-semibold">
									이메일 계정으로 로그인
								</span>
							</Button>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default Login;
