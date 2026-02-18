import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { AxiosError } from 'axios';

export const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error) => {
			const axiosError = error as AxiosError<{ message: string }>;
			const message =
				axiosError.response?.data?.message || '데이터를 불러오는 중 오류가 발생했습니다.';
			toast.error(message);
		},
	}),
	mutationCache: new MutationCache({
		onError: (error) => {
			const axiosError = error as AxiosError<{ message: string }>;
			const message =
				axiosError.response?.data?.message || '요청 처리 중 오류가 발생했습니다.';
			toast.error(message);
		},
	}),
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5,
			gcTime: 1000 * 60 * 10,
			retry: 1,
			refetchOnWindowFocus: false,
		},
	},
});
