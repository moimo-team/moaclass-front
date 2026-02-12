import { useQuery } from "@tanstack/react-query";
import { fetchLatestLessons, fetchLessons } from "@/api/lesson.api";
import type {
  Lesson,
  FetchLessonsResponse,
  FetchLessonsParams,
} from "@/models/lesson.model";

export const useLatestLessonsQuery = () => {
  return useQuery<Lesson[], Error>({
    queryKey: ["lessons", "latest"],
    queryFn: fetchLatestLessons,
  });
};

export const useLessonsQuery = (
  params: FetchLessonsParams,
  page: number,
  enabled: boolean,
) => {
  const queryParams = { ...params, page };

  return useQuery<FetchLessonsResponse, Error>({
    queryKey: ["lessons", queryParams],
    queryFn: () => fetchLessons(queryParams),
    enabled, // 필터 상태 초기화가 완료된 이후에 사용 가능하도록 수정
  });
};
