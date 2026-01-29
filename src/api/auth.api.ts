import type { LoginFormValues } from "@/pages/user/Login";
import { apiClient } from "@/api/client";
import type { JoinFormValues } from "@/pages/user/Join";
import type { User } from "@/models/user.model";
import type { FindPasswordFormValues } from "@/pages/user/FindPassword";
import type { ResetPasswordFormValues } from "@/pages/user/ResetPassword";

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
  try {
    const response = await apiClient.post("/users/login", data);
    // const accessToken = response.headers.authorization?.replace("Bearer ", "");
    const accessToken =
      response.data.accessToken ||
      response.headers.authorization?.replace("Bearer ", "");
    return {
      ...response.data,
      accessToken,
    };
  } catch (error) {
    console.error("login error:", error);
    throw error;
  }
};

export const googleLogin = async (data: {
  code: string;
  redirectUri: string;
}): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post("/users/login/google", data);
    // const accessToken = response.headers.authorization?.replace("Bearer ", "");
    const accessToken =
      response.data.accessToken ||
      response.headers.authorization?.replace("Bearer ", "");
    return {
      ...response.data,
      accessToken,
    };
  } catch (error) {
    console.error("googleLogin error:", error);
    throw error;
  }
};

// 로그아웃
export const logout = async () => {
  try {
    const response = await apiClient.post(`/users/logout`);
    return response.data;
  } catch (error) {
    console.error("logout error:", error);
    throw error;
  }
};

export interface JoinResponse {
  message: string;
  accessToken?: string;
  user: User;
}

// 회원가입
export const join = async (data: JoinFormValues): Promise<JoinResponse> => {
  try {
    const response = await apiClient.post("/users/register", data);
    // const accessToken = response.headers.authorization?.replace("Bearer ", "");
    const accessToken =
      response.data.accessToken ||
      response.headers.authorization?.replace("Bearer ", "");
    return {
      ...response.data,
      accessToken,
    };
  } catch (error) {
    console.error("join error:", error);
    throw error;
  }
};

// 이메일 중복확인
export const checkEmail = async (data: { email: string }) => {
  try {
    const response = await apiClient.post("/users/check-email", data);
    return response.data;
  } catch (error) {
    console.error("checkEmail error:", error);
    throw error;
  }
};

// 닉네임 중복확인
export const checkNickname = async (data: { nickname: string }) => {
  try {
    const response = await apiClient.post("/users/check-nickname", data);
    return response.data;
  } catch (error) {
    console.error("checkNickname error:", error);
    throw error;
  }
};

// 비밀번호 찾기
export const findPassword = async (data: FindPasswordFormValues) => {
  try {
    const response = await apiClient.post(
      "/users/password-reset/request",
      data,
    );
    return response.data;
  } catch (error) {
    console.error("findPassword error:", error);
    throw error;
  }
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
  try {
    const response = await apiClient.post("/users/password-reset/verify", data);
    return response.data;
  } catch (error) {
    console.error("verifyResetCode error:", error);
    throw error;
  }
};

// 비밀번호 재설정
export const resetPassword = async (data: ResetPasswordFormValues) => {
  try {
    const response = await apiClient.put("/users/password-reset/confirm", data);
    return response.data;
  } catch (error) {
    console.error("resetPassword error:", error);
    throw error;
  }
};

// 토큰 갱신
export const refresh = async (): Promise<string | undefined> => {
  try {
    const response = await apiClient.post("/users/refresh");
    // const accessToken = response.headers.authorization?.replace("Bearer ", "");
    const accessToken =
      response.data.accessToken ||
      response.headers.authorization?.replace("Bearer ", "");
    return accessToken;
  } catch (error) {
    console.error("refresh error:", error);
    throw error;
  }
};

export interface VerifyUserResponse {
  authenticated: boolean;
  isNewUser: boolean;
  id: number;
  email: string;
  nickname: string;
  bio: string;
  profileImage: string;
  interests: {
    id: number;
    name: string;
  }[];
  accessToken: string;
}

// 사용자 인증
export const verifyUser = async () => {
  try {
    const response = await apiClient.get<VerifyUserResponse>("/users/verify");
    const headerToken = response.headers.authorization?.replace("Bearer ", "");
    const bodyToken = response.data.accessToken;
    const accessToken = bodyToken || headerToken;

    if (accessToken) {
      return {
        ...response.data,
        accessToken,
      };
    }

    return response.data;
  } catch (error) {
    console.error("verify error:", error);
    throw error;
  }
};
