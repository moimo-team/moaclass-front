import { getUserPoints } from "@/api/point.api";
import { useQuery } from "@tanstack/react-query";

/**
 * 사용자 포인트 내역 조회
 * @returns 포인트 목록
 */
export const usePointQuery = () => {
  return useQuery({
    queryKey: ["point"],
    queryFn: () => getUserPoints(),
    staleTime: 1000 * 60 * 30, // 30분
    gcTime: 1000 * 60 * 60, // 1시간
  });
};
