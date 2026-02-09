import { cancelLike, addLike } from "@/api/like.api";
import type { WishlistResponse } from "@/models/wishlist.model";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// 좋아요 추가
export const useAddLikeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lessonId: number) => addLike(lessonId),
    onSuccess: () => {
      // 위시리스트 캐시 무효화 (다음 방문 시 새로 조회)
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
};

// 좋아요 취소
export const useCancelLikeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lessonId: number) => cancelLike(lessonId),
    // 1. 뮤테이션 실행 전: 이전 데이터를 저장하고 즉시 UI 업데이트
    onMutate: async (lessonId) => {
      // 진행 중인 refetch를 취소하여 낙관적 업데이트를 덮어쓰지 않도록 함
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });

      // 모든 wishlist 쿼리의 이전 데이터를 스냅샷으로 저장 (롤백용)
      const previousQueries = queryClient.getQueriesData<WishlistResponse>({
        queryKey: ["wishlist"],
      });

      // 낙관적 업데이트: 모든 wishlist 쿼리에서 해당 lessonId를 즉시 제거
      queryClient.setQueriesData<WishlistResponse>(
        { queryKey: ["wishlist"] },
        (old) => {
          if (!old) return old;

          return {
            ...old,
            data: old.data.filter((item) => item.lessonId !== lessonId),
            meta: {
              ...old.meta,
              totalCount: old.meta.totalCount - 1,
            },
          };
        },
      );

      // 롤백을 위해 이전 데이터를 반환
      return { previousQueries };
    },
    // 2. 에러 발생 시: 이전 상태로 롤백
    onError: (_err, _lessonId, context) => {
      // context에 저장된 이전 데이터로 복원
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    // 3. 성공 또는 실패 후: 서버 데이터와 동기화
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
};
