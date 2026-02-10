import {
  useMutation,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import { addLessonLike, removeLessonLike } from "@/api/like.api";
import type { Lesson } from "@/models/lesson.model";
import { toast } from "sonner";

interface ToggleLikeVariables {
  lessonId: number;
  newIsLiked: boolean;
}

interface LessonLikeMutationContext {
  previousData: Array<{
    queryKey: QueryKey;
    data: Lesson[] | Lesson | undefined;
  }>;
}

export const useLessonLikeMutation = (
  queryKeysToInvalidate: QueryKey[] = [["lessons"]],
) => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    ToggleLikeVariables,
    LessonLikeMutationContext
  >({
    mutationFn: async ({ lessonId, newIsLiked }: ToggleLikeVariables) => {
      if (newIsLiked) {
        return addLessonLike(lessonId);
      } else {
        return removeLessonLike(lessonId);
      }
    },
    onMutate: async ({ lessonId, newIsLiked }) => {
      // 1. 진행 중인 쿼리 취소 및 이전 데이터 백업
      const previousData: LessonLikeMutationContext["previousData"] = [];

      for (const queryKey of queryKeysToInvalidate) {
        await queryClient.cancelQueries({ queryKey });

        const previous = queryClient.getQueryData<Lesson[] | Lesson>(queryKey);
        previousData.push({ queryKey, data: previous });

        // 2. 낙관적 업데이트
        queryClient.setQueryData<Lesson[] | Lesson>(queryKey, (oldData) => {
          if (!oldData) return oldData;

          if (Array.isArray(oldData)) {
            return oldData.map((lesson) =>
              lesson.id === lessonId
                ? {
                    ...lesson,
                    isLiked: newIsLiked,
                    likes: newIsLiked ? lesson.likes + 1 : lesson.likes - 1,
                  }
                : lesson,
            );
          } else {
            const lesson = oldData as Lesson;
            if (lesson.id === lessonId) {
              return {
                ...lesson,
                isLiked: newIsLiked,
                likes: newIsLiked ? lesson.likes + 1 : lesson.likes - 1,
              };
            }
            return oldData;
          }
        });
      }

      return { previousData };
    },
    onError: (err, __, context) => {
      toast.error("좋아요 토글 실패.");
      // 3. 에러 발생 시 이전 데이터로 롤백
      if (context?.previousData) {
        context.previousData.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error("좋아요 상태 변경에 실패했습니다.");
    },
    onSettled: (_, __, ___, context) => {
      // 4. 성공/실패 여부와 관계없이 쿼리 무효화 (최신 데이터 동기화)
      for (const { queryKey } of context?.previousData || []) {
        queryClient.invalidateQueries({ queryKey });
      }
    },
  });
};
