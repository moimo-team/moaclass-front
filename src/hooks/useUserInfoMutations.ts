import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { userInfoUpdate } from '@/api/userInfo.api';

export const useUserUpdateMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: FormData) => {
			return await userInfoUpdate(data);
		},
		onSuccess: () => {
			// users/verify와 통합되었으므로 authUser 쿼리를 invalidate
			queryClient.invalidateQueries({ queryKey: ['authUser'] });
			toast.success('새로운 프로필을 등록했습니다.');
		},
	});
};
