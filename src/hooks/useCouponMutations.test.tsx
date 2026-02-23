import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { issueCoupon } from '@/api/coupon.api';
import { useIssueCouponMutation } from '@/hooks/useCouponMutations';

vi.mock('@/api/coupon.api', () => ({
	issueCoupon: vi.fn(),
}));

const createQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: { retry: false },
			mutations: { retry: false },
		},
	});

const createWrapper = (queryClient: QueryClient) => {
	return ({ children }: { children: ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};

describe('useIssueCouponMutation', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('issues coupon and invalidates coupon query caches on success', async () => {
		vi.mocked(issueCoupon).mockResolvedValue({
			id: 200,
			userId: 1,
			couponId: 5,
			isUsed: false,
			usedAt: null,
			issuedAt: '2026-02-23T00:00:00.000Z',
		});

		const queryClient = createQueryClient();
		const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

		const { result } = renderHook(() => useIssueCouponMutation(), {
			wrapper: createWrapper(queryClient),
		});

		result.current.mutate({
			userId: 1,
			couponId: 5,
		});

		await waitFor(() => {
			expect(issueCoupon).toHaveBeenCalled();
			const [variables] = vi.mocked(issueCoupon).mock.calls[0];
			expect(variables).toEqual({
				userId: 1,
				couponId: 5,
			});
		});

		await waitFor(() => {
			expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['coupons', 'me'] });
			expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['coupons', 'available'] });
		});
	});
});
