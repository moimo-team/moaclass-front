import type { ReactNode } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import LessonCard from '@/components/features/lessons/LessonCard';
import type { Lesson } from '@/models/lesson.model';

const mockMutate = vi.fn();

vi.mock('next/image', () => ({
	default: ({ alt, src }: { alt: string; src: string }) => <img alt={alt} src={src} />,
}));

vi.mock('next/link', () => ({
	default: ({ href, children, ...props }: { href: string; children: ReactNode }) => (
		<a href={href} {...props}>
			{children}
		</a>
	),
}));

vi.mock('@/hooks/useLessonLikeMutation', () => ({
	useLessonLikeMutation: () => ({
		mutate: mockMutate,
		isPending: false,
	}),
}));

const createLesson = (isLiked = false): Lesson => ({
	id: 1,
	userId: 1,
	lessonCategoryId: 1,
	lessonCategoryName: '카테고리',
	title: '테스트 클래스',
	description: '설명',
	level: 'BEGINNER',
	durationMin: 60,
	curriculum: '커리큘럼',
	status: 'ACTIVE',
	price: 10000,
	discountRate: 0,
	discountedPrice: 10000,
	maxParticipants: 10,
	representativeImage: '',
	likeCount: 3,
	regionId: 1,
	regionName: '서울',
	address: '서울',
	latitude: 0,
	longitude: 0,
	detailAddress: '',
	directionsText: '',
	reservationLeadDays: 1,
	rate: 5,
	deletedAt: null,
	reviewAiSummary: null,
	createdAt: '2026-01-01T00:00:00.000Z',
	updatedAt: '2026-01-01T00:00:00.000Z',
	teacher: {
		id: 1,
		nickname: '모멘토',
		image: '',
	},
	subCategories: [],
	schedules: [],
	isLiked,
	classCategory: { id: 1, name: '체험' },
});

const Pathname = () => {
	const location = useLocation();
	return <div data-testid="pathname">{location.pathname}</div>;
};

const renderWithRouter = (node: ReactNode) =>
	render(
		<MemoryRouter initialEntries={['/lessons']}>
			<Pathname />
			{node}
		</MemoryRouter>,
	);

describe('LessonCard like interaction', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('prevents navigation when like button is clicked', async () => {
		renderWithRouter(<LessonCard lesson={createLesson(false)} />);

		await userEvent.click(screen.getByRole('button', { name: '좋아요' }));

		expect(screen.getByTestId('pathname')).toHaveTextContent('/lessons');
	});

	it('calls onToggleLike first when callback is provided', async () => {
		const onToggleLike = vi.fn();
		renderWithRouter(<LessonCard lesson={createLesson(true)} onToggleLike={onToggleLike} />);

		await userEvent.click(screen.getByRole('button', { name: '좋아요 취소' }));

		expect(onToggleLike).toHaveBeenCalledWith(1, true);
		expect(mockMutate).not.toHaveBeenCalled();
	});

	it('calls useLessonLikeMutation when onToggleLike is not provided', async () => {
		renderWithRouter(<LessonCard lesson={createLesson(false)} />);

		await userEvent.click(screen.getByRole('button', { name: '좋아요' }));

		expect(mockMutate).toHaveBeenCalledWith({ lessonId: 1, newIsLiked: true });
	});
});
