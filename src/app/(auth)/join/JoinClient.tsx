'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	useEmailCheckMutation,
	useJoinMutation,
	useNicknameCheckMutation,
} from '@/hooks/useAuthMutations';

// zod schema 정의
export const joinSchema = z
	.object({
		email: z
			.string()
			.min(1, '이메일을 입력해주세요.')
			.email('이메일 형식이 올바르지 않습니다.'),
		nickname: z.string().min(1, '닉네임을 입력해주세요.'),
		password: z
			.string()
			.min(1, '비밀번호를 입력해주세요.')
			.min(8, '비밀번호는 최소 8자 이상이어야 합니다.'),
		passwordConfirm: z
			.string()
			.min(1, '비밀번호를 입력해주세요.')
			.min(8, '비밀번호는 최소 8자 이상이어야 합니다.'),
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: '비밀번호가 일치하지 않습니다.',
		path: ['passwordConfirm'],
	});

// zod schema에서 추출한 타입
export type JoinFormValues = z.infer<typeof joinSchema>;

const JoinClient = () => {
	const { mutateAsync: joinMutation, isPending } = useJoinMutation();
	const emailCheckMutation = useEmailCheckMutation();
	const nicknameCheckMutation = useNicknameCheckMutation();
	const router = useRouter();

	const {
		register,
		handleSubmit,
		setError,
		clearErrors,
		getValues,
		formState: { errors },
	} = useForm<JoinFormValues>({
		resolver: zodResolver(joinSchema),
		defaultValues: {
			email: '',
			password: '',
			passwordConfirm: '',
		},
	});

	const onSubmit = async (data: JoinFormValues) => {
		if (!emailCheckMutation.isSuccess) {
			toast.error('이메일 중복 확인을 해주세요.');
			return;
		}

		if (!nicknameCheckMutation.isSuccess) {
			toast.error('닉네임 중복 확인을 해주세요.');
			return;
		}

		try {
			await joinMutation(data);
			toast.success('회원가입이 완료되었습니다.');
			router.push('/user-info');
		} catch (error) {
			console.error('회원가입 중 오류 발생: ', error);
			setError('root', {
				type: 'manual',
				message: '회원가입에 실패했습니다.',
			});
		}
	};

	const handleCheckEmail = async () => {
		const email = getValues('email');
		if (!email) {
			setError('email', { type: 'manual', message: '이메일을 입력해주세요.' });
			return;
		}

		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailPattern.test(email)) {
			setError('email', { type: 'manual', message: '이메일 형식이 올바르지 않습니다.' });
			return;
		}

		clearErrors('email');
		await emailCheckMutation.mutateAsync(email);
	};

	const handleCheckNickname = async () => {
		const nickname = getValues('nickname');
		if (!nickname) {
			setError('nickname', { type: 'manual', message: '닉네임을 입력해주세요.' });
			return;
		}

		clearErrors('nickname');
		await nicknameCheckMutation.mutateAsync(nickname);
	};

	return (
		<div className="flex min-h-full w-full flex-col items-center justify-center bg-transparent p-4">
			<Card className="w-full max-w-[440px] p-8 shadow-lg border-none bg-login-form rounded-[12px]">
				<CardHeader>
					<CardTitle className="text-2xl font-bold text-center text-foreground mb-2">
						모이모 가입하기
					</CardTitle>
					<CardDescription className="text-center">
						새로운 계정을 만들어 모이모와 함께해요
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-8 p-0">
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="flex flex-col gap-6">
							<div className="grid gap-2">
								<Label
									htmlFor="email"
									className="text-sm font-medium text-muted-foreground mr-auto"
								>
									이메일
								</Label>
								<div className="flex gap-2">
									<Input
										{...register('email')}
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
										{emailCheckMutation.isPending ? '확인중...' : '중복확인'}
									</Button>
								</div>
								{errors.email ? (
									<p className="text-sm text-destructive">
										{errors.email.message}
									</p>
								) : emailCheckMutation.isError ? (
									<p className="text-sm text-destructive">
										{'이미 사용 중인 이메일입니다.'}
									</p>
								) : emailCheckMutation.isSuccess ? (
									<p className="text-sm text-success">
										{'사용 가능한 이메일입니다.'}
									</p>
								) : null}
							</div>

							<div className="grid gap-2">
								<Label
									htmlFor="nickname"
									className="text-sm font-medium text-muted-foreground mr-auto"
								>
									닉네임
								</Label>
								<div className="flex gap-2">
									<Input
										{...register('nickname')}
										type="text"
										placeholder="노래하는햄스터"
										className="h-12 border-input focus-visible:ring-primary flex-1"
									/>
									<Button
										type="button"
										onClick={handleCheckNickname}
										disabled={nicknameCheckMutation.isPending}
										className="h-12 px-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-[8px] transition-colors shadow-none border-none shrink-0"
									>
										{nicknameCheckMutation.isPending ? '확인중...' : '중복확인'}
									</Button>
								</div>
								{errors.nickname ? (
									<p className="text-sm text-destructive">
										{errors.nickname.message}
									</p>
								) : nicknameCheckMutation.isError ? (
									<p className="text-sm text-destructive">
										{'이미 사용 중인 닉네임입니다.'}
									</p>
								) : nicknameCheckMutation.isSuccess ? (
									<p className="text-sm text-success">
										{'사용 가능한 닉네임입니다.'}
									</p>
								) : null}
							</div>

							<div className="grid gap-2">
								<Label
									htmlFor="password"
									className="text-sm font-medium text-muted-foreground mr-auto"
								>
									비밀번호
								</Label>
								<Input
									{...register('password')}
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

							<div className="grid gap-2">
								<Label
									htmlFor="passwordConfirm"
									className="text-sm font-medium text-muted-foreground mr-auto"
								>
									비밀번호 확인
								</Label>
								<Input
									{...register('passwordConfirm')}
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

							{errors.root && (
								<p className="text-sm text-destructive">{errors.root.message}</p>
							)}

							<Button
								type="submit"
								disabled={isPending}
								className="w-full h-14 mt-2 text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-md border-none"
							>
								{isPending ? '가입 중...' : '회원가입하기'}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export default JoinClient;
