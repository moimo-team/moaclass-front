import { useQuery } from '@tanstack/react-query';

import { getRegions } from '@/api/region.api';
import { REGIONS } from '@/constants/regions';

export const useRegionQuery = () => {
	return useQuery({
		queryKey: ['regions'],
		queryFn: async () => {
			try {
				const data = await getRegions();
				if (!data || data.length === 0) return REGIONS;
				return data;
			} catch (error) {
				console.warn('지역 데이터를 불러오지 못했습니다. 기본값을 사용합니다.', error);
				return REGIONS;
			}
		},
		// queryFn: () => getRegions(),
		staleTime: 1000 * 60 * 30, // 30분
		retry: false,
	});
};
