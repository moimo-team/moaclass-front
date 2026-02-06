import { getInterests } from "@/api/interest.api";
import type { LessonCategory } from "@/models/lesson.model";
import { useQuery } from "@tanstack/react-query";

/**
 * @deprecated useCategoryQuery를 사용하세요. 이 훅은 하위 호환성을 위해 유지됩니다.
 * useInterestQuery는 내부적으로 useCategoryQuery와 동일한 쿼리 캐시를 공유합니다.
 */
export const useInterestQuery = () => {
    return useQuery<LessonCategory[]>({
        queryKey: ["lessonCategories"],
        queryFn: getInterests,
        staleTime: 1000 * 60 * 60, // 1시간 동안 데이터를 '신선한(fresh)' 상태로 간주
        gcTime: 1000 * 60 * 60 * 24, // 가비지 컬렉션 타임을 24시간으로 설정하여 캐시 유지
        retry: 1, // 실패 시 재시도 횟수 제한
    });
}
