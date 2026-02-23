import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { TeacherProfile } from '@/models/lesson.model';

import { LessonTabContent } from './LessonTabContent';

vi.mock('@/components/features/map/kakaoMaps/KakaoMapView', () => ({
	default: () => <div data-testid="kakao-map-view" />,
}));

vi.mock('@components/features/lessons/ReviewList', () => ({
	ReviewList: () => <div data-testid="review-list" />,
}));

const baseTeacher: TeacherProfile = {
	id: 11,
	nickname: '모멘토',
	image: '',
	introduction: '소개 문구',
};

const baseProps = {
	activeTab: 'intro',
	tabTitles: [{ id: 'intro', title: '소개' }],
	handleTabClick: vi.fn(),
	onSectionRef: vi.fn(),
	description: '클래스 설명',
	curriculum: '커리큘럼',
	teacher: baseTeacher,
	latitude: 37.5,
	longitude: 127,
	address: '서울시',
	detailAddress: '강남구',
	directionsText: '찾아오는 길',
	navigate: vi.fn(),
	reviewAiSummary: null,
	reviews: [],
};

describe('LessonTabContent', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		(window as typeof window & { kakao?: unknown }).kakao = {
			maps: {
				load: (callback: () => void) => callback(),
			},
		};
	});

	it('uses default profile image when teacher image is empty', () => {
		render(
			<MemoryRouter>
				<LessonTabContent {...baseProps} />
			</MemoryRouter>,
		);

		const profileImage = screen.getByAltText('모멘토') as HTMLImageElement;
		expect(profileImage).toBeInTheDocument();
		expect(profileImage.getAttribute('src') || '').toContain('profile');
	});

	it('renders KakaoMapView after kakao map is loaded', async () => {
		render(
			<MemoryRouter>
				<LessonTabContent {...baseProps} />
			</MemoryRouter>,
		);

		await waitFor(() => {
			expect(screen.getByTestId('kakao-map-view')).toBeInTheDocument();
		});
	});
});
