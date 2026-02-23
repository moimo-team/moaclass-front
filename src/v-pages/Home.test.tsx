import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

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
	it('요청한 4개 섹션을 순서대로 렌더링한다', () => {
		mockUseAuthStore.mockReturnValue({ isLoggedIn: false });
		mockUseCategoryQuery.mockReturnValue({
			data: [
				{ id: 10, name: '체험' },
				{ id: 1, name: '핸드메이드' },
			],
		});

		render(<Home />);

		const sectionTitles = [
			...screen.getAllByText(
				/좋아요 많은 클래스|체험 추천 클래스|핸드메이드 추천 클래스|서울 지역 추천 클래스/,
			),
		].map((node) => node.textContent);

		expect(sectionTitles).toEqual([
			'좋아요 많은 클래스',
			'체험 추천 클래스',
			'핸드메이드 추천 클래스',
			'서울 지역 추천 클래스',
		]);
	});

	it('카테고리가 없으면 해당 카테고리 섹션만 숨긴다', () => {
		mockUseAuthStore.mockReturnValue({ isLoggedIn: false });
		mockUseCategoryQuery.mockReturnValue({
			data: [{ id: 10, name: '체험' }],
		});

		render(<Home />);

		expect(screen.getByText('좋아요 많은 클래스')).toBeInTheDocument();
		expect(screen.getByText('체험 추천 클래스')).toBeInTheDocument();
		expect(screen.queryByText('핸드메이드 추천 클래스')).not.toBeInTheDocument();
		expect(screen.getByText('서울 지역 추천 클래스')).toBeInTheDocument();
	});
});
