import type { ReactNode } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Banner from '@/components/features/home/banner';

import type * as ReactRouterDom from 'react-router-dom';

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

vi.mock('react-router-dom', async (importOriginal) => {
	const actual = await importOriginal<typeof ReactRouterDom>();
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
	}: {
		children: ReactNode;
		onClick?: () => void;
		disabled?: boolean;
		asChild?: boolean;
	}) => {
		if (asChild) return <>{children}</>;
		return (
			<button type="button" onClick={onClick} disabled={disabled}>
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

		await userEvent.click(screen.getByRole('button', { name: '쿠폰 받기' }));

		expect(mockMutateAsync).not.toHaveBeenCalled();
		expect(mockNavigate).toHaveBeenCalledWith('/login');
	});

	it('issues coupon when logged in and marks button as completed', async () => {
		mockIsLoggedIn = true;
		mockUserId = 1;
		mockMutateAsync.mockResolvedValue({
			id: 1,
			userId: 1,
			couponId: 4,
			isUsed: false,
			usedAt: null,
			issuedAt: '2026-02-23T00:00:00.000Z',
		});

		render(
			<MemoryRouter>
				<Banner />
			</MemoryRouter>,
		);

		await userEvent.click(screen.getByRole('button', { name: '쿠폰 받기' }));

		await waitFor(() => {
			expect(mockMutateAsync).toHaveBeenCalledWith({ userId: 1, couponId: 4 });
			expect(screen.getByRole('button', { name: '발급 완료' })).toBeDisabled();
		});
	});

	it('disables button when coupon already exists from server response', () => {
		mockIsLoggedIn = true;
		mockUserId = 1;
		mockUserCoupons = [{ couponId: 4 }];

		render(
			<MemoryRouter>
				<Banner />
			</MemoryRouter>,
		);

		expect(screen.getByRole('button', { name: '발급 완료' })).toBeDisabled();
	});

	it('marks button as completed when issue API responds with duplicate status', async () => {
		mockIsLoggedIn = true;
		mockUserId = 1;
		mockMutateAsync.mockRejectedValue({ response: { status: 409 } });

		render(
			<MemoryRouter>
				<Banner />
			</MemoryRouter>,
		);

		await userEvent.click(screen.getByRole('button', { name: '쿠폰 받기' }));

		await waitFor(() => {
			expect(screen.getByRole('button', { name: '발급 완료' })).toBeDisabled();
		});
	});

	it('disables button while issue mutation is pending', () => {
		mockIsPending = true;
		mockIsLoggedIn = true;
		mockUserId = 1;

		render(
			<MemoryRouter>
				<Banner />
			</MemoryRouter>,
		);

		expect(screen.getByRole('button', { name: '쿠폰 발급 중' })).toBeDisabled();
	});
});
