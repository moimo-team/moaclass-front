import { useMutation, useQueryClient } from '@tanstack/react-query';

import { issueCoupon, type IssueCouponRequest, type IssueCouponResponse } from '@/api/coupon.api';
import { BANNER_COUPON_CODE, BANNER_COUPON_ID } from '@/constants/coupon';
import type { CouponInfo } from '@/models/coupon.model';

// 배너 쿠폰 전용 mutation
export const useIssueCouponMutation = () => {
	const queryClient = useQueryClient();

	return useMutation<IssueCouponResponse, Error, IssueCouponRequest>({
		mutationFn: issueCoupon,
		onSuccess: (_result, variables) => {
			const optimisticCouponCode =
				variables.couponId === BANNER_COUPON_ID ? BANNER_COUPON_CODE : undefined;

			queryClient.setQueryData<CouponInfo[] | undefined>(['coupons', 'me'], (previous) => {
				if (!previous) {
					return [
						{
							id: variables.couponId,
							couponId: variables.couponId,
							code: optimisticCouponCode,
							status: 'AVAILABLE',
						},
					];
				}

				const exists = previous.some(
					(coupon) =>
						coupon.couponId === variables.couponId ||
						coupon.id === variables.couponId ||
						(Boolean(optimisticCouponCode) && coupon.code === optimisticCouponCode),
				);
				if (exists) {
					return previous;
				}

				return [
					...previous,
					{
						id: variables.couponId,
						couponId: variables.couponId,
						code: optimisticCouponCode,
						status: 'AVAILABLE',
					},
				];
			});
			queryClient.invalidateQueries({ queryKey: ['coupons', 'me'] });
			queryClient.invalidateQueries({ queryKey: ['coupons', 'available'] });
		},
	});
};
