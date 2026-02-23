import type { ReactNode } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Banner, { BANNER_COUPON_ID } from '@/components/features/home/banner';

const mockMutateAsync = vi.fn();
const mockNavigate = vi.fn();
let mockIsPending = false;
let mockIsLoggedIn = false;
let mockUserId: number | null = null;
let mockUserCoupons: Array<{ id?: number; couponId?: number; code?: string }> = [];

vi.mock('@/hooks/useCouponMutations', () => ({
	useIssueCouponMutation: () => ({
		mutateAsync: mockMutateAsync,
		isPending: mockIsPending,
	}),
}));

vi.mock('@/hooks/useCouponQuery', () => ({
	useUserCouponsQuery: () => ({
		data: mockUserCoupons,
	}),
}));

vi.mock('@/store/authStore', () => ({
	useAuthStore: () => ({
		isLoggedIn: mockIsLoggedIn,
		userId: mockUserId,
	}),
}));

vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual('react-router-dom');
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

vi.mock('@/components/ui/carousel', () => ({
	Carousel: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	CarouselContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	CarouselItem: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	CarouselPrevious: () => <button type="button">prev</button>,
	CarouselNext: () => <button type="button">next</button>,
}));

vi.mock('@/components/ui/card', () => ({
	Card: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	CardContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/components/ui/button', () => ({
	Button: ({
		children,
		onClick,
		disabled,
		asChild,
		...rest
	}: {
		children: ReactNode;
		onClick?: () => void;
		disabled?: boolean;
		asChild?: boolean;
		'data-testid'?: string;
	}) => {
		if (asChild) {
			return <>{children}</>;
		}
		return (
			<button type="button" onClick={onClick} disabled={disabled} {...rest}>
				{children}
			</button>
		);
	},
}));

describe('Banner coupon issue flow', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockIsPending = false;
		mockIsLoggedIn = false;
		mockUserId = null;
		mockUserCoupons = [];
	});

	it('redirects to login and does not call API when logged out', async () => {
		render(
			<MemoryRouter>
				<Banner />
			</MemoryRouter>,
		);

		await userEvent.click(screen.getByTestId('banner-coupon-button'));

		expect(mockMutateAsync).not.toHaveBeenCalled();
		expect(mockNavigate).toHaveBeenCalledWith('/login');
	});

	it('issues coupon once when logged in', async () => {
		mockIsLoggedIn = true;
		mockUserId = 7;
		mockMutateAsync.mockResolvedValue({
			id: 1,
			userId: 7,
			couponId: BANNER_COUPON_ID,
			isUsed: false,
			usedAt: null,
			issuedAt: '2026-02-23T00:00:00.000Z',
		});

		render(
			<MemoryRouter>
				<Banner />
			</MemoryRouter>,
		);

		const couponButton = screen.getByTestId('banner-coupon-button');
		await userEvent.click(couponButton);
		await userEvent.click(couponButton);

		await waitFor(() => {
			expect(mockMutateAsync).toHaveBeenCalledTimes(1);
			expect(mockMutateAsync).toHaveBeenCalledWith({
				userId: 7,
				couponId: BANNER_COUPON_ID,
			});
		});
	});

	it('disables coupon button when already issued from server data', () => {
		mockIsLoggedIn = true;
		mockUserId = 7;
		mockUserCoupons = [{ couponId: BANNER_COUPON_ID }];

		render(
			<MemoryRouter>
				<Banner />
			</MemoryRouter>,
		);

		expect(screen.getByTestId('banner-coupon-button')).toBeDisabled();
	});

	it('marks coupon as issued when API returns duplicate response', async () => {
		mockIsLoggedIn = true;
		mockUserId = 7;
		mockMutateAsync.mockRejectedValue({ response: { status: 409 } });

		render(
			<MemoryRouter>
				<Banner />
			</MemoryRouter>,
		);

		await userEvent.click(screen.getByTestId('banner-coupon-button'));

		await waitFor(() => {
			expect(screen.getByTestId('banner-coupon-button')).toBeDisabled();
		});
	});

	it('keeps button enabled when API fails with non-duplicate error', async () => {
		mockIsLoggedIn = true;
		mockUserId = 7;
		mockMutateAsync.mockRejectedValue({ response: { status: 500 } });

		render(
			<MemoryRouter>
				<Banner />
			</MemoryRouter>,
		);

		await userEvent.click(screen.getByTestId('banner-coupon-button'));

		await waitFor(() => {
			expect(mockMutateAsync).toHaveBeenCalledTimes(1);
		});
		expect(screen.getByTestId('banner-coupon-button')).not.toBeDisabled();
	});

	it('disables button while mutation is pending', () => {
		mockIsPending = true;
		mockIsLoggedIn = true;
		mockUserId = 7;

		render(
			<MemoryRouter>
				<Banner />
			</MemoryRouter>,
		);

		expect(screen.getByTestId('banner-coupon-button')).toBeDisabled();
	});
});
