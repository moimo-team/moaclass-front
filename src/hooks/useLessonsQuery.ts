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
  const queryKey = ["lessons", queryParams];

  const queryResult = useQuery<FetchLessonsResponse, Error>({
    queryKey,
    queryFn: () => fetchLessons(queryParams),
    enabled,
  });

  return { ...queryResult, queryKey };
};
