import { useQuery } from '@tanstack/react-query';

import { getUserPoints } from '@/api/point.api';
import { useAuthStore } from '@/store/authStore';

/**
 * 사용자 포인트 내역 조회
 * @returns 포인트 목록
 */
export const usePointQuery = () => {
	const userId = useAuthStore((state) => state.userId);

	return useQuery({
		queryKey: ['points', 'me', userId],
		queryFn: () => getUserPoints(),
		enabled: !!userId,
	});
};
