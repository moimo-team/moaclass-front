import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Lesson } from "@/models/lesson.model";
import { delay } from "msw"; // Simulate API call delay

interface ToggleLikeVariables {
  lessonId: number;
  newIsLiked: boolean;
}

// onMutate에서 반환될 context의 타입을 정의
interface LessonLikeMutationContext {
  previousLessons?: Lesson[];
}

export const useLessonLikeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    ToggleLikeVariables,
    LessonLikeMutationContext // Context 타입을 여기에 지정
  >({
    mutationFn: async ({ lessonId, newIsLiked }) => {
      // TODO: 실제 API 호출 로직
      // 예: await api.post(`/lessons/${lessonId}/like`, { isLiked: newIsLiked });
      await delay(500); // Simulate network request
      console.log(
        `[Mock API] Toggled like for lesson ${lessonId} to ${newIsLiked}`,
      );
    },
    onMutate: async ({ lessonId, newIsLiked }) => {
      // 쿼리 취소하여 새 데이터 가져오는 것을 방지
      await queryClient.cancelQueries({ queryKey: ["latestLessons"] });

      // 이전 값 저장 (에러 발생 시 롤백을 위함)
      const previousLessons = queryClient.getQueryData<Lesson[]>([
        "latestLessons",
      ]);

      // 낙관적 업데이트: 특정 레슨의 isLiked 상태 변경
      queryClient.setQueryData<Lesson[]>(["latestLessons"], (oldLessons) => {
        return oldLessons?.map((lesson) =>
          lesson.id === lessonId ? { ...lesson, isLiked: newIsLiked } : lesson,
        );
      });

      return { previousLessons };
    },
    onError: (err, _, context) => {
      console.error("좋아요 토글 실패:", err);
      // 에러 발생 시 롤백
      if (context?.previousLessons) {
        queryClient.setQueryData<Lesson[]>(
          ["latestLessons"],
          context.previousLessons,
        );
      }
    },
    onSettled: () => {
      // 뮤테이션이 성공하든 실패하든, 쿼리 데이터를 무효화하여 최신 데이터를 다시 가져옴
      // (낙관적 업데이트를 사용했으므로 이 단계는 선택적일 수 있으나 안전을 위해 포함)
      queryClient.invalidateQueries({ queryKey: ["latestLessons"] });
    },
  });
};
