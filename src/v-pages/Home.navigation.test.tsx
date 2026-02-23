import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { HOME_CATEGORIES, HOME_SECTION_LINKS } from '@/test/fixtures/home.fixture';
import { renderHome } from '@/test/utils/renderHome';

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
	default: ({ title, seeMoreHref }: { title: string; seeMoreHref: string }) => {
		const idByTitle: Record<string, string> = {
			'좋아요 많은 클래스': 'likes',
			'체험 추천 클래스': 'experience',
			'핸드메이드 추천 클래스': 'handmade',
			'서울 지역 추천 클래스': 'seoul',
		};
		const id = idByTitle[title] ?? 'unknown';
		return (
			<a href={seeMoreHref} data-testid={`home-see-more-${id}`}>
				{title}
			</a>
		);
	},
}));

describe('Home section navigation links', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseAuthStore.mockReturnValue({ isLoggedIn: false });
		mockUseAuthQuery.mockReturnValue({ data: null });
	});

	it('renders all section links with correct hrefs when categories exist', () => {
		mockUseCategoryQuery.mockReturnValue({
			data: HOME_CATEGORIES.all,
		});

		renderHome(<Home />);

		expect(screen.getByTestId('home-see-more-likes')).toHaveAttribute(
			'href',
			HOME_SECTION_LINKS.likes,
		);
		expect(screen.getByTestId('home-see-more-experience')).toHaveAttribute(
			'href',
			HOME_SECTION_LINKS.experience(10),
		);
		expect(screen.getByTestId('home-see-more-handmade')).toHaveAttribute(
			'href',
			HOME_SECTION_LINKS.handmade(11),
		);
		expect(screen.queryByTestId('home-see-more-seoul')).not.toBeInTheDocument();
	});

	it('hides category sections when category does not exist', () => {
		mockUseCategoryQuery.mockReturnValue({
			data: HOME_CATEGORIES.experienceOnly,
		});

		renderHome(<Home />);

		expect(screen.getByTestId('home-see-more-experience')).toBeInTheDocument();
		expect(screen.queryByTestId('home-see-more-handmade')).not.toBeInTheDocument();
		expect(screen.queryByTestId('home-see-more-seoul')).not.toBeInTheDocument();
	});

	it('renders region link when logged in with region', () => {
		mockUseAuthStore.mockReturnValue({ isLoggedIn: true });
		mockUseAuthQuery.mockReturnValue({ data: { region: { id: 5, name: '대전' } } });
		mockUseCategoryQuery.mockReturnValue({ data: HOME_CATEGORIES.all });

		renderHome(<Home />);

		expect(screen.getByTestId('home-see-more-unknown')).toHaveAttribute(
			'href',
			'/lessons?regionId=5&sort=LATEST',
		);
	});
});
