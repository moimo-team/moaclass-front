import { useQuery } from "@tanstack/react-query";
import { verifyUser } from "@/api/auth.api";
import { getUserInfoById } from "@/api/userInfo.api";

/**
 * @deprecated useAuthQuery를 사용하세요. 이 훅은 하위 호환성을 위해 유지됩니다.
 * useUserInfoQuery는 내부적으로 useAuthQuery와 동일한 쿼리 캐시를 공유합니다.
 */
export const useUserInfoQuery = () => {
    return useQuery({
        queryKey: ["authUser"],  // useAuthQuery와 동일한 쿼리 키 사용
        queryFn: async () => {
            const verifyUserInfo = await verifyUser();
            return verifyUserInfo;
        },
        staleTime: 1000 * 60 * 5, // 5분
        retry: false,
    });
}

// id로 프로필정보 조회
export const useUserInfoByIdQuery = (userId: number) => {
    return useQuery({
        queryKey: ["userInfoById", userId],
        queryFn: async () => {
            const response = await getUserInfoById(userId);
            return response.data;
        },
        staleTime: 1000 * 60 * 5, // 5분
        retry: false,
        enabled: !!userId,  // userId가 0인 경우 쿼리 실행되지 않도록 
    });
}