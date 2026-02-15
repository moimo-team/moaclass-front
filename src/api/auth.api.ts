import { apiClient } from '@/api/client';
import type { User } from '@/models/user.model';
import type { FindPasswordFormValues } from '@/pages/user/FindPassword';
import type { JoinFormValues } from '@/pages/user/Join';
import type { LoginFormValues } from '@/pages/user/Login';
import type { ResetPasswordFormValues } from '@/pages/user/ResetPassword';

export interface LoginResponse {
	user: {
		id: number;
		isNewUser: boolean;
		email: string;
		nickname: string;
	};
	accessToken: string;
}

// 일반 로그인
export const login = async (data: LoginFormValues): Promise<LoginResponse> => {
	const response = await apiClient.post('/users/login', data);
	const accessToken = response.headers.authorization?.replace('Bearer ', '');
	return {
		...response.data,
		accessToken,
	};
};

export const googleLogin = async (data: {
	code: string;
	redirectUri: string;
}): Promise<LoginResponse> => {
	const response = await apiClient.post('/users/login/google', data);
	const accessToken = response.headers.authorization?.replace('Bearer ', '');
	return {
		...response.data,
		accessToken,
	};
};

export const kakaoLogin = async (data: {
	code: string;
	redirectUri: string;
}): Promise<LoginResponse> => {
	const response = await apiClient.post('/users/login/kakao', data);
	const accessToken = response.headers.authorization?.replace('Bearer ', '');
	return {
		...response.data,
		accessToken,
	};
};

// 로그아웃
export const logout = async () => {
	const response = await apiClient.post(`/users/logout`);
	return response.data;
};

export interface JoinResponse {
	message: string;
	accessToken?: string;
	user: User;
}

// 회원가입
export const join = async (data: JoinFormValues): Promise<JoinResponse> => {
	const response = await apiClient.post('/users/register', data);
	const accessToken = response.headers.authorization?.replace('Bearer ', '');
	return {
		...response.data,
		accessToken,
	};
};

// 이메일 중복확인
export const checkEmail = async (data: { email: string }) => {
	const response = await apiClient.post('/users/check-email', data);
	return response.data;
};

// 닉네임 중복확인
export const checkNickname = async (data: { nickname: string }) => {
	const response = await apiClient.post('/users/check-nickname', data);
	return response.data;
};

// 비밀번호 찾기
export const findPassword = async (data: FindPasswordFormValues) => {
	const response = await apiClient.post('/users/password-reset/request', data);
	return response.data;
};

export interface VerifyResetCodeResponse {
	message: string;
	resetToken: string;
}

// 비밀번호 인증코드 확인
export const verifyResetCode = async (data: {
	email: string;
	code: string;
}): Promise<VerifyResetCodeResponse> => {
	const response = await apiClient.post('/users/password-reset/verify', data);
	return response.data;
};

// 비밀번호 재설정
export const resetPassword = async (data: ResetPasswordFormValues) => {
	const response = await apiClient.put('/users/password-reset/confirm', data);
	return response.data;
};

// 토큰 갱신
export const refresh = async (): Promise<string | undefined> => {
	const response = await apiClient.post('/users/refresh');
	const accessToken = response.headers.authorization?.replace('Bearer ', '');
	// const accessToken =
	// 	response.data.accessToken || response.headers.authorization?.replace('Bearer ', '');
	return accessToken;
};

export interface VerifyUserResponse {
	authenticated: boolean;
	isNewUser: boolean;
	id: number;
	email: string;
	nickname: string;
	bio: string;
	point: number;
	region?: {
		id: number;
		name: string;
	};
	profileImage: string;
	interests: {
		id: number;
		name: string;
	}[];
	accessToken: string;
}

// 사용자 인증
export const verifyUser = async () => {
	const response = await apiClient.get<VerifyUserResponse>('/users/verify');
	const accessToken = response.headers.authorization?.replace('Bearer ', '');

	if (accessToken) {
		return {
			...response.data,
			accessToken,
		};
	}

	return response.data;
};

// 회원 탈퇴
export const deleteUser = async () => {
	const response = await apiClient.delete('/users');
	return response.data;
};
