import { useQuery } from '@tanstack/react-query';

import { getRegions } from '@/api/region.api';

export const useRegionQuery = () => {
	return useQuery({
		queryKey: ['regions'],
		queryFn: () => getRegions(),
		staleTime: 1000 * 60 * 30, // 30분
		retry: false,
	});
};
