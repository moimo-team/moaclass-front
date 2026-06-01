import { useQuery } from '@tanstack/react-query';

import { getInterests } from '@/api/interest.api';
import { INTEREST_CATEGORIES } from '@/constants/interestCategories';
import type { Interest } from '@/models/interest.model';

export const useInterestQuery = () => {
	return useQuery<Interest[]>({
		queryKey: ['interests'],
		queryFn: async () => {
			try {
				const data = await getInterests();
				if (!data || data.length === 0) return INTEREST_CATEGORIES;
				return data;
			} catch (error) {
				console.warn('관심사 데이터를 불러오지 못했습니다. 기본값을 사용합니다.', error);
				return INTEREST_CATEGORIES;
			}
		},
		// queryFn: getInterests,
		staleTime: 1000 * 60 * 60, // 1시간 동안 데이터를 '신선한(fresh)' 상태로 간주
		gcTime: 1000 * 60 * 60 * 24, // 가비지 컬렉션 타임을 24시간으로 설정하여 캐시 유지
		retry: 1, // 실패 시 재시도 횟수 제한
	});
};
