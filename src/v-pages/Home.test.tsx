import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import Home from './Home';

const mockUseCategoryQuery = vi.fn();
const mockUseAuthStore = vi.fn();
const mockUseAuthQuery = vi.fn();

vi.mock('@/hooks/useCategoryQuery', () => ({
	useCategoryQuery: () => mockUseCategoryQuery(),
}));

vi.mock('@store/authStore', () => ({
	useAuthStore: () => mockUseAuthStore(),
}));

vi.mock('@/hooks/useAuthQuery', () => ({
	useAuthQuery: () => mockUseAuthQuery(),
}));

vi.mock('@/components/features/home/banner', () => ({
	default: () => <div>Banner</div>,
}));

vi.mock('@/components/features/home/CategorySection', () => ({
	default: () => <div>CategorySection</div>,
}));

vi.mock('@/components/features/home/ReviewListSection', () => ({
	default: () => <div>ReviewListSection</div>,
}));

vi.mock('@/components/features/lessons/NewLessonList', () => ({
	default: () => <div>NewLessonList</div>,
}));

vi.mock('@/components/features/home/JoinedMeetingsList', () => ({
	default: () => <div>JoinedMeetingsList</div>,
}));

vi.mock('@/components/features/home/HostedMeetingsList', () => ({
	default: () => <div>HostedMeetingsList</div>,
}));

vi.mock('@/components/features/home/PendingMeetingsList', () => ({
	default: () => <div>PendingMeetingsList</div>,
}));

vi.mock('@/components/features/lessons/HomeLessonSection', () => ({
	default: ({ title, seeMoreHref }: { title: string; seeMoreHref: string }) => (
		<div>
			<div>{title}</div>
			<div>{seeMoreHref}</div>
		</div>
	),
}));

describe('Home', () => {
	it('renders likes section and hides region section for logged-out users', () => {
		mockUseAuthStore.mockReturnValue({ isLoggedIn: false });
		mockUseAuthQuery.mockReturnValue({ data: null });
		mockUseCategoryQuery.mockReturnValue({
			data: [
				{ id: 10, name: 'experience' },
				{ id: 1, name: 'handmade' },
			],
		});

		render(<Home />);

		expect(screen.getByText('/lessons?sort=LIKES')).toBeInTheDocument();
		expect(screen.queryByText('/lessons?regionId=1&sort=LATEST')).not.toBeInTheDocument();
	});

	it('keeps region section hidden for logged-out users even with category changes', () => {
		mockUseAuthStore.mockReturnValue({ isLoggedIn: false });
		mockUseAuthQuery.mockReturnValue({ data: null });
		mockUseCategoryQuery.mockReturnValue({
			data: [{ id: 10, name: 'experience' }],
		});

		render(<Home />);

		expect(screen.getByText('/lessons?sort=LIKES')).toBeInTheDocument();
		expect(screen.queryByText('/lessons?regionId=1&sort=LATEST')).not.toBeInTheDocument();
	});
});
