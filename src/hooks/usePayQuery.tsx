import { useQuery } from '@tanstack/react-query';

import {
	calculateCouponDiscount,
	getPayPreview,
	type CouponCalculateValues,
	type GetPayPreviewParams,
} from '@/api/pay.api';

export const usePayPreviewQuery = (params: GetPayPreviewParams) => {
	return useQuery({
		queryKey: ['pay-preview', params],
		queryFn: () => getPayPreview(params),
		enabled: !!params.scheduleId && !!params.quantity,
	});
};

// 쿠폰 선택 계산 (Query 버전)
export const usePayCalculation = (data: CouponCalculateValues | null) => {
	return useQuery({
		queryKey: ['payCalculation', data],
		queryFn: () => calculateCouponDiscount(data!),
		enabled: !!data,
		staleTime: 0, // 실시간성 보장을 위해 0 설정
	});
};
