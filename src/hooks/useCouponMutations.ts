import { useMutation, useQueryClient } from '@tanstack/react-query';

import { issueCoupon, type IssueCouponRequest, type IssueCouponResponse } from '@/api/coupon.api';
import type { CouponInfo } from '@/models/coupon.model';

export const useIssueCouponMutation = () => {
	const queryClient = useQueryClient();

	return useMutation<IssueCouponResponse, Error, IssueCouponRequest>({
		mutationFn: issueCoupon,
		onSuccess: (_result, variables) => {
			queryClient.setQueryData<CouponInfo[] | undefined>(['coupons', 'me'], (previous) => {
				if (!previous) {
					return [
						{
							id: variables.couponId,
							couponId: variables.couponId,
							code: 'BANNER10',
							status: 'AVAILABLE',
						},
					];
				}

				const exists = previous.some(
					(coupon) =>
						coupon.couponId === variables.couponId ||
						coupon.id === variables.couponId ||
						coupon.code === 'BANNER10',
				);
				if (exists) {
					return previous;
				}

				return [
					...previous,
					{
						id: variables.couponId,
						couponId: variables.couponId,
						code: 'BANNER10',
						status: 'AVAILABLE',
					},
				];
			});
			queryClient.invalidateQueries({ queryKey: ['coupons', 'me'] });
			queryClient.invalidateQueries({ queryKey: ['coupons', 'available'] });
		},
	});
};
