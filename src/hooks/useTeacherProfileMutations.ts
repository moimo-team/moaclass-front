import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
	createTeacherProfile,
	deleteTeacherProfile,
	fetchTeacherProfile,
	updateTeacherProfile,
} from '@/api/teacher.api';
import { useAuthStore } from '@/store/authStore';

import type { AxiosError } from 'axios';

// ... (existing functions)

// 선생님 프로필 삭제 Mutation
export const useDeleteTeacherProfileMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteTeacherProfile,
		onSuccess: () => {
			const userId = useAuthStore.getState().userId;
			if (userId) {
				queryClient.setQueryData(['teacherProfile', userId], null);
			}
			queryClient.invalidateQueries({ queryKey: ['authUser'] });
			queryClient.invalidateQueries({ queryKey: ['teacherProfile'] });
			toast.success('모멘토 프로필이 삭제되었습니다.');
		},
	});
};

// 선생님 프로필 조회 Query
export const useTeacherProfileQuery = (userId?: number) => {
	return useQuery({
		queryKey: ['teacherProfile', userId],
		queryFn: async () => {
			if (!userId) throw new Error('UserId is required');
			try {
				return await fetchTeacherProfile(userId);
			} catch (error) {
				const axiosError = error as AxiosError;
				if (axiosError.response?.status === 404) {
					return null;
				}
				throw error;
			}
		},
		enabled: !!userId,
	});
};

// 선생님 프로필 등록 Mutation
export const useCreateTeacherProfileMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createTeacherProfile,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['authUser'] });
			toast.success('모멘토 프로필이 등록되었습니다.');
		},
	});
};

// 선생님 프로필 수정 Mutation
export const useUpdateTeacherProfileMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateTeacherProfile,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['authUser'] });
			queryClient.invalidateQueries({ queryKey: ['teacherProfile'] });
			toast.success('모멘토 프로필이 수정되었습니다.');
		},
	});
};
