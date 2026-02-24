import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createEnrollment } from '@/api/pay.api';
import { type PayInfoValues } from '@/api/pay.api';
import { type PayErrorResponse } from '@/models/pay.model';
import { useAuthStore } from '@/store/authStore';

import type { AxiosError } from 'axios';

// 결제하기 훅
export const usePayMutation = () => {
	const queryClient = useQueryClient();
	const { userId } = useAuthStore();

	return useMutation({
		mutationFn: async (data: PayInfoValues) => {
			return await createEnrollment(data);
		},
		meta: { useBackendError: true },
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orderlist', userId] });
		},
		onError: (error: AxiosError<PayErrorResponse>) => {
			console.error(error);
		},
	});
};
