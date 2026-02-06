import { useQuery } from "@tanstack/react-query";
import { verifyUser } from "@/api/auth.api";
import { useAuthStore } from "@/store/authStore";

export const useAuthQuery = () => {
    return useQuery({
        queryKey: ["authUser"],
        queryFn: async () => {
            const { accessToken: currentToken, storeLogin, storeLogout, isLoggedIn } = useAuthStore.getState();

            try {
                const verifyUserInfo = await verifyUser();

                if (verifyUserInfo.authenticated) {
                    // 중요: 인터셉터가 토큰을 갱신했을 수 있으므로 최신 상태를 확인합니다.
                    const latestToken = useAuthStore.getState().accessToken;
                    const tokenToStore = verifyUserInfo.accessToken || latestToken || currentToken;

                    storeLogin({ id: verifyUserInfo.id, nickname: verifyUserInfo.nickname }, tokenToStore!);
                    return verifyUserInfo;
                }
                if (isLoggedIn) {
                    storeLogout();
                }
                return null;
            } catch (error) {
                if (isLoggedIn) {
                    storeLogout();
                }
                return null;
            }
        },
        // 사용자가 앱을 사용하는 동안 인증 상태를 유지하기 위해 staleTime 설정
        staleTime: 1000 * 60 * 30, // 30분
        retry: false, // 인증 실패 시 반복 요청 방지
    });
};
