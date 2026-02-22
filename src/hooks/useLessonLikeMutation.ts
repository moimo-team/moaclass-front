import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query';
import { toast } from 'sonner';

import { addLike, cancelLike } from '@/api/like.api';
import type { FetchLessonsResponse, Lesson } from '@/models/lesson.model';

interface ToggleLikeVariables {
	lessonId: number;
	newIsLiked: boolean;
}

interface LessonLikeMutationContext {
	previousData: Array<{
		queryKey: QueryKey;
		data: Lesson[] | Lesson | FetchLessonsResponse | undefined;
	}>;
}

export const useLessonLikeMutation = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, ToggleLikeVariables, LessonLikeMutationContext>({
		mutationFn: async ({ lessonId, newIsLiked }: ToggleLikeVariables) => {
			if (newIsLiked) {
				await addLike(lessonId);
				return;
			}

			await cancelLike(lessonId);
		},
		onMutate: async ({ lessonId, newIsLiked }) => {
			// 1. 진행 중인 쿼리 취소 및 이전 데이터 백업
			const previousData: LessonLikeMutationContext['previousData'] = [];

			// 활성화된 모든 lesson 쿼리를 동적으로 찾기
			const queryCache = queryClient.getQueryCache();
			const queryKeysToUpdate = queryCache
				.findAll({ queryKey: ['lessons'], type: 'active' })
				.map((query) => query.queryKey);

			for (const queryKey of queryKeysToUpdate) {
				await queryClient.cancelQueries({ queryKey });

				const previous = queryClient.getQueryData<Lesson[] | Lesson | FetchLessonsResponse>(
					queryKey,
				);
				previousData.push({ queryKey, data: previous });

				// 2. 낙관적 업데이트
				queryClient.setQueryData<Lesson[] | Lesson | FetchLessonsResponse>(
					queryKey,
					(oldData) => {
						if (!oldData) return oldData;

						// FetchLessonsResponse 객체 (useLessonsQuery)
						if (
							typeof oldData === 'object' &&
							'data' in oldData &&
							Array.isArray(oldData.data)
						) {
							// isLiked=true 필터 쿼리(위시리스트)에서 좋아요 취소 시 항목 즉시 제거
							const params = queryKey[2] as Record<string, unknown> | undefined;
							if (params?.isLiked === true && !newIsLiked) {
								return {
									...oldData,
									data: oldData.data.filter((lesson) => lesson.id !== lessonId),
									meta: {
										...oldData.meta,
										totalCount: Math.max(0, oldData.meta.totalCount - 1),
									},
								};
							}

							return {
								...oldData,
								data: oldData.data.map((lesson) =>
									lesson.id === lessonId
										? {
												...lesson,
												isLiked: newIsLiked,
												likeCount: newIsLiked
													? lesson.likeCount + 1
													: lesson.likeCount - 1,
											}
										: lesson,
								),
							};
						}
						// Lesson 배열 (useLatestLessonsQuery, useParticipationQuery 등)
						else if (Array.isArray(oldData)) {
							return oldData.map((lesson) =>
								lesson.id === lessonId
									? {
											...lesson,
											isLiked: newIsLiked,
											likeCount: newIsLiked
												? lesson.likeCount + 1
												: lesson.likeCount - 1,
										}
									: lesson,
							);
						}
						// 단일 Lesson 객체 (useLessonQuery)
						else if (typeof oldData === 'object' && 'id' in oldData) {
							const lesson = oldData as Lesson;
							if (lesson.id === lessonId) {
								return {
									...lesson,
									isLiked: newIsLiked,
									likeCount: newIsLiked
										? lesson.likeCount + 1
										: lesson.likeCount - 1,
								};
							}
						}
						return oldData;
					},
				);
			}

			return { previousData };
		},
		onError: (_, __, context) => {
			// 3. 에러 발생 시 이전 데이터로 롤백
			if (context?.previousData) {
				context.previousData.forEach(({ queryKey, data }) => {
					queryClient.setQueryData(queryKey, data);
				});
			}
			toast.error('좋아요 상태 변경에 실패했습니다.');
		},
		onSettled: () => {
			// 4. 성공/실패 여부와 관계없이 모든 lesson 관련 쿼리 무효화 (최신 데이터 동기화)
			queryClient.invalidateQueries({ queryKey: ['lessons'] });
		},
	});
};
