import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createLesson, updateLesson, deleteLesson } from '@/api/lesson.api';

/**
 * 1. 클래스 생성 Mutation
 */
export const useCreateLessonMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: createLesson,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['lessons'] });
		},
	});
};

/**
 * 2. 클래스 수정 Mutation
 */
export const useUpdateLessonMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ lessonId, formData }: { lessonId: number; formData: FormData }) =>
			updateLesson(lessonId, formData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['lessons'] });
		},
	});
};

/**
 * 3. 클래스 삭제 Mutation
 */
export const useDeleteLessonMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteLesson,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['lessons'] });
		},
	});
};
