import { useQuery } from "@tanstack/react-query";
import { getMyMeetings } from "@/api/me.api";
import { usePagination } from "./usePagination";
import { useAuthStore } from "@/store/authStore";

// 내 모임 목록 조회
export const useMeQuery = (
  view: 'joined' | 'hosted' | 'all', 
  status: string = "all", 
  page: number = 1, 
  limit: number = 5,
  options?: { enabled?: boolean }
) => {
    const { userId } = useAuthStore();

    const queryResult = useQuery({
        queryKey: ["my-meetings", userId, view, status, page, limit],
        queryFn: () => getMyMeetings(view, status, page, limit),
        staleTime: 0, // 사용자 전환 시 즉시 새로운 데이터를 가져오도록 설정
        gcTime: 1000 * 60 * 30, // 가비지 컬렉션 타임은 유지
        retry: 1,
        enabled: options?.enabled,
    });

    const { totalPages, isFirstPage, isLastPage } = usePagination({
        page,
        limit,
        totalCount: queryResult.data?.meta?.totalCount ?? 0,
        apiTotalPages: queryResult.data?.meta?.totalPages ?? 1,
    });

    return {
        ...queryResult,
        meetings: queryResult.data?.data ?? [],
        meta: queryResult.data?.meta,
        totalPages,
        isFirstPage,
        isLastPage,
    };
};