import type { LoginFormValues } from "@/pages/user/Login";
import { useAuthStore } from "@/store/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  login,
  join,
  checkEmail,
  checkNickname,
  findPassword,
  resetPassword,
  googleLogin,
  logout,
  verifyResetCode,
} from "@/api/auth.api";
import { AxiosError } from "axios";
import type { JoinFormValues } from "@/pages/user/Join";
import type { FindPasswordFormValues } from "@/pages/user/FindPassword";
import type { ResetPasswordFormValues } from "@/pages/user/ResetPassword";

// 로그인 Mutation
export const useLoginMutation = () => {
  const { storeLogin } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginFormValues) => {
      return await login(data);
    },
    onSuccess: (data) => {
      // 로그인 성공 시 전역 상태 업데이트
      storeLogin(
        { id: data.user.id, nickname: data.user.nickname },
        data.accessToken
      );
      // 인증 상태 쿼리 초기화
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      console.error(error);
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
        { id: data.user.id, nickname: data.user.nickname },
        data.accessToken
      );
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error(error);
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
      // 로그아웃 성공 시 전역 상태 업데이트 및 캐시 전체 삭제
      storeLogout();
      queryClient.clear();
    },
    onError: (error) => {
      console.error(error);
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
          { id: data.user.id, nickname: data.user.nickname },
          data.accessToken
        );
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
      }
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error(error);
    },
  });
};

// 이메일 중복 확인 Mutation
export const useEmailCheckMutation = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      return await checkEmail({ email });
    },
    onSuccess: () => { },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error(error);
    },
  });
};

// 닉네임 중복 확인 Mutation
export const useNicknameCheckMutation = () => {
  return useMutation({
    mutationFn: async (nickname: string) => {
      return await checkNickname({ nickname });
    },
    onSuccess: () => { },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error(error);
    },
  });
};

// 비밀번호 찾기 Mutation
export const useFindPasswordMutation = () => {
  return useMutation({
    mutationFn: async (data: FindPasswordFormValues) => {
      return await findPassword(data);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error(error);
    },
  });
};

// 비밀번호 코드 인증 Mutation
export const useVerifyResetCodeMutation = () => {
  return useMutation({
    mutationFn: async (data: { email: string; code: string }) => {
      return await verifyResetCode(data);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error(error);
    },
  });
};

// 비밀번호 재설정 Mutation
export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: async (data: ResetPasswordFormValues) => {
      return await resetPassword(data);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error(error);
    },
  });
};
