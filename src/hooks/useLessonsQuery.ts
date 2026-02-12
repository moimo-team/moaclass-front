import { useQuery } from '@tanstack/react-query';
import { fetchLatestLessons, fetchLessons } from '@/api/lesson.api';
import type {
  Lesson,
  FetchLessonsParams,
  FetchLessonsResponse,
} from '@/models/lesson.model';

export const useLatestLessonsQuery = () => {
  return useQuery<Lesson[], Error>({
    queryKey: ['lessons', 'latest'],
    queryFn: fetchLatestLessons,
  });
};

export const useLessonsQuery = (
  params: FetchLessonsParams,
  searchTrigger: number,
) => {
  return useQuery<FetchLessonsResponse, Error>({
    queryKey: ['lessons', params, searchTrigger],
    queryFn: () => fetchLessons(params),
  });
};
