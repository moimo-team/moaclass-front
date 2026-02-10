import { getUserPoints } from "@/api/point.api";
import { useAuthStore } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";

/**
 * 사용자 포인트 내역 조회
 * @returns 포인트 목록
 */
export const usePointQuery = () => {
  const userId = useAuthStore((state) => state.userId);

  return useQuery({
    queryKey: ["points", "me", userId],
    queryFn: () => getUserPoints(),
    enabled: !!userId,
    staleTime: 1000 * 60 * 30, // 30분
    gcTime: 1000 * 60 * 60, // 1시간
    // 프론트엔드에서 최신순으로 정렬 (백엔드에서 정렬되지 않았을 경우 대비)
    select: (data) =>
      [...data].sort((a, b) => {
        const dateA = new Date(
          a.createdAt.includes(" ")
            ? a.createdAt.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")
            : a.createdAt,
        ).getTime();
        const dateB = new Date(
          b.createdAt.includes(" ")
            ? b.createdAt.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")
            : b.createdAt,
        ).getTime();
        return dateB - dateA;
      }),
  });
};
