import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { AxiosError } from 'axios';

export const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error) => {
			const axiosError = error as AxiosError<{ message: string }>;
			const message =
				axiosError.response?.data?.message || '데이터를 불러오는 중 오류가 발생했습니다.';
			console.error(message);
		},
	}),
	mutationCache: new MutationCache({
		onError: (error, _variables, _context, mutation) => {
			const axiosError = error as AxiosError<{ message: string }>;
			const status = axiosError.response?.status;

			let message = '';

			// 1. 백엔드 메시지 우선 사용 설정 확인
			if (mutation.meta?.useBackendError) {
				message = axiosError.response?.data?.message || '';
			}

			// 2. 상황별(상태 코드별) 프론트엔드 메시지 매핑 확인
			if (!message && mutation.meta?.errorMessages) {
				const errorMessages = mutation.meta.errorMessages as Record<
					number | string,
					string
				>;
				message = errorMessages[status ?? 0] || errorMessages['default'] || '';
			}

			// 3. 단일 커스텀 메시지 확인
			if (!message) {
				message =
					(mutation.meta?.errorMessage as string) || '요청 처리 중 오류가 발생했습니다.';
			}

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
