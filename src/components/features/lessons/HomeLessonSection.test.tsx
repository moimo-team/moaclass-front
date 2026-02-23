import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { Lesson } from '@/models/lesson.model';

import HomeLessonSection from './HomeLessonSection';

const mockUseHomeLessonSectionQuery = vi.fn();

vi.mock('@/hooks/useLessonsQuery', () => ({
	useHomeLessonSectionQuery: (...args: never[]) => mockUseHomeLessonSectionQuery(...args),
}));

vi.mock('@/components/features/lessons/LessonListSection', () => ({
	default: ({
		title,
		seeMoreHref,
		lessons,
		isLoading,
		isError,
		hideIfEmpty,
	}: {
		title: string;
		seeMoreHref: string;
		lessons: Lesson[];
		isLoading: boolean;
		isError: boolean;
		hideIfEmpty: boolean;
	}) => (
		<div>
			<div>{title}</div>
			<div>{seeMoreHref}</div>
			<div>count:{lessons.length}</div>
			<div>loading:{String(isLoading)}</div>
			<div>error:{String(isError)}</div>
			<div>hide:{String(hideIfEmpty)}</div>
		</div>
	),
}));

describe('HomeLessonSection', () => {
	it('쿼리 성공 시 목록 데이터를 전달한다', () => {
		mockUseHomeLessonSectionQuery.mockReturnValue({
			data: [{ id: 1 }, { id: 2 }],
			isLoading: false,
			isError: false,
		});

		render(
			<HomeLessonSection
				title="좋아요 많은 클래스"
				seeMoreHref="/lessons?sort=LIKES"
				queryParams={{ sort: 'LIKES' }}
			/>,
		);

		expect(screen.getByText('좋아요 많은 클래스')).toBeInTheDocument();
		expect(screen.getByText('/lessons?sort=LIKES')).toBeInTheDocument();
		expect(screen.getByText('count:2')).toBeInTheDocument();
	});

	it('빈 결과도 hideIfEmpty=true로 전달한다', () => {
		mockUseHomeLessonSectionQuery.mockReturnValue({
			data: [],
			isLoading: false,
			isError: false,
		});

		render(
			<HomeLessonSection
				title="서울 지역 추천 클래스"
				seeMoreHref="/lessons?regionId=1&sort=LATEST"
				queryParams={{ regionId: [1], sort: 'LATEST' }}
			/>,
		);

		expect(screen.getByText('count:0')).toBeInTheDocument();
		expect(screen.getByText('hide:true')).toBeInTheDocument();
	});

	it('에러 상태를 전달한다', () => {
		mockUseHomeLessonSectionQuery.mockReturnValue({
			data: [],
			isLoading: false,
			isError: true,
		});

		render(
			<HomeLessonSection
				title="체험 추천 클래스"
				seeMoreHref="/lessons?categoryId=10&sort=LATEST"
				queryParams={{ categoryId: 10, sort: 'LATEST' }}
			/>,
		);

		expect(screen.getByText('error:true')).toBeInTheDocument();
	});
});
