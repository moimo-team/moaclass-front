import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
	login,
	join,
	checkEmail,
	checkNickname,
	findPassword,
	resetPassword,
	googleLogin,
	kakaoLogin,
	logout,
	verifyResetCode,
	deleteUser,
} from '@/api/auth.api';
import type { FindPasswordFormValues } from '@/pages/user/FindPassword';
import type { JoinFormValues } from '@/pages/user/Join';
import type { LoginFormValues } from '@/pages/user/Login';
import type { ResetPasswordFormValues } from '@/pages/user/ResetPassword';
import { useAuthStore } from '@/store/authStore';

// 로그인 Mutation
export const useLoginMutation = () => {
	const { storeLogin } = useAuthStore();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: LoginFormValues) => {
			return await login(data);
		},
		// meta: {
		// 	errorMessages: {
		// 		401: '아이디 또는 비밀번호가 틀렸습니다.',
		// 		default: '로그인 중 오류가 발생했습니다.',
		// 	},
		// },
		onSuccess: (data) => {
			// 로그인 성공 시 전역 상태 업데이트
			storeLogin(
				{
					id: data.user.id,
					nickname: data.user.nickname,
					email: data.user.email,
					teacherProfile: false,
				},
				data.accessToken,
			);
			// 인증 상태 쿼리 초기화
			queryClient.invalidateQueries({ queryKey: ['authUser'] });
		},
	});
};

// 구글 로그인 Mutation
export const useGoogleLoginMutation = () => {
	const { storeLogin } = useAuthStore();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: { code: string; redirectUri: string }) => {
			return await googleLogin(data);
		},
		onSuccess: (data) => {
			storeLogin(
				{
					id: data.user.id,
					nickname: data.user.nickname,
					email: data.user.email,
					teacherProfile: false,
				},
				data.accessToken,
			);
			queryClient.invalidateQueries({ queryKey: ['authUser'] });
		},
	});
};

// 카카오 로그인 Mutation
export const useKakaoLoginMutation = () => {
	const { storeLogin } = useAuthStore();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: { code: string; redirectUri: string }) => {
			return await kakaoLogin(data);
		},
		onSuccess: (data) => {
			storeLogin(
				{
					id: data.user.id,
					nickname: data.user.nickname,
					email: data.user.email,
					teacherProfile: false,
				},
				data.accessToken,
			);
			queryClient.invalidateQueries({ queryKey: ['authUser'] });
		},
	});
};

// 로그아웃 Mutation
export const useLogoutMutation = () => {
	const { storeLogout } = useAuthStore();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			return await logout();
		},
		onSuccess: () => {
			storeLogout();
			queryClient.clear();
			queryClient.invalidateQueries({ queryKey: ['authUser'] });
		},
	});
};

// 회원가입 Muatation
export const useJoinMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: JoinFormValues) => {
			return await join(data);
		},
		onSuccess: (data) => {
			const { storeLogin } = useAuthStore.getState();
			if (data.accessToken) {
				storeLogin(
					{
						id: data.user.id,
						nickname: data.user.nickname,
						email: data.user.email,
						teacherProfile: false,
					},
					data.accessToken,
				);
				queryClient.invalidateQueries({ queryKey: ['authUser'] });
			}
		},
	});
};

// 이메일 중복 확인 Mutation
export const useEmailCheckMutation = () => {
	return useMutation({
		mutationFn: async (email: string) => {
			return await checkEmail({ email });
		},
		onSuccess: () => {},
	});
};

// 닉네임 중복 확인 Mutation
export const useNicknameCheckMutation = () => {
	return useMutation({
		mutationFn: async (nickname: string) => {
			return await checkNickname({ nickname });
		},
		onSuccess: () => {},
	});
};

// 비밀번호 찾기 Mutation
export const useFindPasswordMutation = () => {
	return useMutation({
		mutationFn: async (data: FindPasswordFormValues) => {
			return await findPassword(data);
		},
	});
};

// 비밀번호 코드 인증 Mutation
export const useVerifyResetCodeMutation = () => {
	return useMutation({
		mutationFn: async (data: { email: string; code: string }) => {
			return await verifyResetCode(data);
		},
	});
};

// 비밀번호 재설정 Mutation
export const useResetPasswordMutation = () => {
	return useMutation({
		mutationFn: async (data: ResetPasswordFormValues) => {
			return await resetPassword(data);
		},
	});
};

// 회원 탈퇴
export const useDeleteUserMutation = () => {
	const { storeLogout } = useAuthStore();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async () => {
			return await deleteUser();
		},
		meta: { useBackendError: true },
		onSuccess: () => {
			storeLogout();
			queryClient.clear();
			queryClient.invalidateQueries({ queryKey: ['authUser'] });

			toast.success('회원탈퇴가 완료되었습니다.');
		},
	});
};
