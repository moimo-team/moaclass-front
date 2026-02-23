import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { HOME_CATEGORIES } from '@/test/fixtures/home.fixture';
import { renderHome } from '@/test/utils/renderHome';

import Home from './Home';

const mockUseCategoryQuery = vi.fn();
const mockUseAuthStore = vi.fn();

vi.mock('@/hooks/useCategoryQuery', () => ({
	useCategoryQuery: () => mockUseCategoryQuery(),
}));

vi.mock('@store/authStore', () => ({
	useAuthStore: () => mockUseAuthStore(),
}));

vi.mock('@/components/features/home/banner', () => ({
	default: () => <div data-testid="banner">Banner</div>,
}));

vi.mock('@/components/features/home/CategorySection', () => ({
	default: () => <div data-testid="category-section">CategorySection</div>,
}));

vi.mock('@/components/features/home/ReviewListSection', () => ({
	default: () => <div data-testid="review-section">ReviewListSection</div>,
}));

vi.mock('@/components/features/lessons/NewLessonList', () => ({
	default: () => <div data-testid="new-lesson-section">NewLessonList</div>,
}));

vi.mock('@/components/features/lessons/HomeLessonSection', () => ({
	default: ({ title }: { title: string }) => <div>{title}</div>,
}));

vi.mock('@/components/features/home/JoinedMeetingsList', () => ({
	default: () => <div data-testid="joined-meetings">JoinedMeetingsList</div>,
}));

vi.mock('@/components/features/home/HostedMeetingsList', () => ({
	default: () => <div data-testid="hosted-meetings">HostedMeetingsList</div>,
}));

vi.mock('@/components/features/home/PendingMeetingsList', () => ({
	default: () => <div data-testid="pending-meetings">PendingMeetingsList</div>,
}));

describe('Home auth-based rendering', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseCategoryQuery.mockReturnValue({ data: HOME_CATEGORIES.all });
	});

	it('shows personalized meeting sections when logged in', () => {
		mockUseAuthStore.mockReturnValue({ isLoggedIn: true, userId: 1 });

		renderHome(<Home />);

		expect(screen.getByTestId('joined-meetings')).toBeInTheDocument();
		expect(screen.getByTestId('hosted-meetings')).toBeInTheDocument();
		expect(screen.getByTestId('pending-meetings')).toBeInTheDocument();
		expect(screen.getByTestId('banner')).toBeInTheDocument();
		expect(screen.getByTestId('category-section')).toBeInTheDocument();
		expect(screen.getByTestId('new-lesson-section')).toBeInTheDocument();
		expect(screen.getByTestId('review-section')).toBeInTheDocument();
	});

	it('hides personalized meeting sections when logged out', () => {
		mockUseAuthStore.mockReturnValue({ isLoggedIn: false, userId: null });

		renderHome(<Home />);

		expect(screen.queryByTestId('joined-meetings')).not.toBeInTheDocument();
		expect(screen.queryByTestId('hosted-meetings')).not.toBeInTheDocument();
		expect(screen.queryByTestId('pending-meetings')).not.toBeInTheDocument();
		expect(screen.getByTestId('banner')).toBeInTheDocument();
		expect(screen.getByTestId('category-section')).toBeInTheDocument();
		expect(screen.getByTestId('new-lesson-section')).toBeInTheDocument();
		expect(screen.getByTestId('review-section')).toBeInTheDocument();
	});

	it('does not crash on logged-in edge state without userId', () => {
		mockUseAuthStore.mockReturnValue({ isLoggedIn: true, userId: null });

		renderHome(<Home />);

		expect(screen.getByTestId('joined-meetings')).toBeInTheDocument();
		expect(screen.getByTestId('hosted-meetings')).toBeInTheDocument();
		expect(screen.getByTestId('pending-meetings')).toBeInTheDocument();
	});
});
