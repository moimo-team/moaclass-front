import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { updateLesson } from '@/api/lesson.api';
export const useToggleLessonStatusMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			lessonId,
			currentStatus,
		}: {
			lessonId: number;
			currentStatus: string;
		}) => {
			const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
			const formData = new FormData();
			formData.append('status', newStatus);
			return updateLesson(lessonId, formData);
		},
		onSuccess: (_, variables) => {
			const newStatus = variables.currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
			const statusText = newStatus === 'ACTIVE' ? '활성화' : '휴면';

			toast.success(`클래스 상태 변경 완료`, {
				description: `클래스가 ${statusText} 상태로 변경되었습니다.`,
			});

			queryClient.invalidateQueries({ queryKey: ['lessons'] });
		},
		onError: () => {
			toast.error('상태 변경 실패', {
				description: '클래스 상태 변경 중 오류가 발생했습니다.',
			});
		},
	});
};
