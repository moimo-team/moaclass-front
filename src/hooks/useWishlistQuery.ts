import { useQuery } from '@tanstack/react-query';

import { getWishlist } from '@/api/like.api';
import { useAuthStore } from '@/store/authStore';

import { usePagination } from './usePagination';

// 내 위시리스트 조회
export const useWishlistQuery = (page: number = 1, limit: number = 8) => {
	const { userId } = useAuthStore();

	const queryResult = useQuery({
		queryKey: ['wishlist', userId, page, limit],
		queryFn: () => getWishlist(page, limit),
		staleTime: 0,
		gcTime: 1000 * 60 * 30,
		retry: 1,
		enabled: !!userId,
	});

	const { totalPages, isFirstPage, isLastPage } = usePagination({
		page,
		limit,
		totalCount: queryResult.data?.meta?.totalCount ?? 0,
		apiTotalPages: queryResult.data?.meta?.totalPages ?? 1,
	});

	return {
		...queryResult,
		wishlist: queryResult.data?.data ?? [],
		meta: queryResult.data?.meta,
		totalPages,
		isFirstPage,
		isLastPage,
	};
};
