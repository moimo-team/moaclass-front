import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { LessonDetail } from '@/models/lesson.model';

import { LessonDetailContent } from './LessonDetail';

const mockMutate = vi.fn();
const mockUseApplicationConfirmation = vi.fn();

const lessonDetailMock: LessonDetail = {
	id: 3,
	userId: 1,
	lessonCategoryId: 1,
	lessonCategoryName: '체험',
	title: '테스트 클래스',
	description: '설명',
	level: 'BEGINNER',
	durationMin: 60,
	curriculum: '커리큘럼',
	status: 'ACTIVE',
	price: 50000,
	discountRate: 0,
	discountedPrice: 50000,
	maxParticipants: 10,
	representativeImage: '',
	likeCount: 7,
	regionId: 1,
	regionName: '서울',
	address: '서울시',
	latitude: 37.5,
	longitude: 127,
	detailAddress: '',
	directionsText: '',
	reservationLeadDays: 1,
	rate: 4.5,
	deletedAt: null,
	reviewAiSummary: null,
	createdAt: '2026-01-01T00:00:00.000Z',
	updatedAt: '2026-01-01T00:00:00.000Z',
	teacher: {
		id: 11,
		nickname: '모멘토',
		image: '',
	},
	subCategories: [],
	schedules: [],
	images: [],
	reviews: [],
	isLiked: false,
};

vi.mock('@/hooks/useLessonQuery', () => ({
	useLessonQuery: () => ({
		data: lessonDetailMock,
		isLoading: false,
		error: null,
	}),
}));

vi.mock('@/hooks/useLessonReviewsQuery', () => ({
	useLessonReviewsQuery: () => ({
		data: { data: [] },
		isLoading: false,
		error: null,
	}),
}));

vi.mock('@/hooks/useLessonTabs', () => ({
	useLessonTabs: () => ({
		activeTab: 'intro',
		tabTitles: [{ id: 'intro', title: '소개' }],
		handleTabClick: vi.fn(),
		handleSectionRef: vi.fn(),
	}),
}));

vi.mock('@/hooks/useLessonLikeMutation', () => ({
	useLessonLikeMutation: () => ({
		mutate: mockMutate,
	}),
}));

vi.mock('@/store/authStore', () => ({
	useAuthStore: () => ({
		isLoggedIn: true,
	}),
}));

vi.mock('@/components/common/LoadingSpinner', () => ({
	default: () => <div>loading</div>,
}));

vi.mock('@/components/features/lessons/LessonGallery', () => ({
	LessonGallery: () => <div>gallery</div>,
}));

vi.mock('@/components/features/lessons/LessonTabContent', () => ({
	LessonTabContent: () => <div>tab-content</div>,
}));

vi.mock('@/components/features/lessons/LessonHeader', () => ({
	LessonHeader: ({ likeCount, isLiked }: { likeCount: number; isLiked: boolean }) => (
		<div>
			<div data-testid="header-like-count">{likeCount}</div>
			<div data-testid="header-like-icon">{isLiked ? 'liked' : 'unliked'}</div>
		</div>
	),
}));

vi.mock('@/components/features/lessons/LessonReservationSidebar', () => ({
	LessonReservationSidebar: ({
		onWishlistToggle,
		isLiked,
	}: {
		onWishlistToggle: () => void;
		isLiked: boolean;
	}) => (
		<div>
			<div data-testid="sidebar-like-icon">{isLiked ? 'liked' : 'unliked'}</div>
			<button type="button" onClick={onWishlistToggle}>
				wishlist-toggle
			</button>
		</div>
	),
}));

describe('LessonDetailContent wishlist interactions', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseApplicationConfirmation.mockReturnValue({
			showConfirmApply: false,
			setShowConfirmApply: vi.fn(),
			selectedScheduleForDisplay: null,
			tempHeadcount: 1,
			onApplyLessonFromSidebar: vi.fn(),
			confirmApplyAction: vi.fn(),
		});
	});

	it('updates wishlist icon/count immediately and calls like mutation', async () => {
		render(
			<LessonDetailContent
				lessonId="3"
				navigate={vi.fn()}
				LoginRequiredDialogComponent={() => null}
				useApplicationConfirmationHook={mockUseApplicationConfirmation}
			/>,
		);

		expect(screen.getByTestId('header-like-icon')).toHaveTextContent('unliked');
		expect(screen.getByTestId('sidebar-like-icon')).toHaveTextContent('unliked');
		expect(screen.getByTestId('header-like-count')).toHaveTextContent('7');

		await userEvent.click(screen.getByRole('button', { name: 'wishlist-toggle' }));

		expect(mockMutate).toHaveBeenCalledWith(
			{ lessonId: 3, newIsLiked: true },
			expect.objectContaining({
				onError: expect.any(Function),
			}),
		);
		expect(screen.getByTestId('header-like-icon')).toHaveTextContent('liked');
		expect(screen.getByTestId('sidebar-like-icon')).toHaveTextContent('liked');
		expect(screen.getByTestId('header-like-count')).toHaveTextContent('8');
	});
});
