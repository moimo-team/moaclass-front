import type { ReactNode } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { REVERSE_DAYS_MAP } from '@/constants/dayConstants';
import { LEVEL_MAP } from '@/constants/lessonConstants';
import type { FetchLessonsParams, FetchLessonsResponse, Lesson } from '@/models/lesson.model';
import { LESSON_LIST_RESPONSE } from '@/test/fixtures/lessonList.fixture';

import { LessonsClient } from './LessonsClient';

const mockPush = vi.fn();
const mockSetAllFilters = vi.fn();
const mockResetFilters = vi.fn();
const mockSetSelectedSort = vi.fn();
const mockScrollToTop = vi.fn();
const mockUseLessonsQuery = vi.fn();

let mockSearchParams = new URLSearchParams();
let mockSelectedSort: string | null = null;
let mockQueryResult: {
	data: FetchLessonsResponse | undefined;
	isLoading: boolean;
	isError: boolean;
} = {
	data: LESSON_LIST_RESPONSE,
	isLoading: false,
	isError: false,
};

vi.mock('@/hooks/useLessonsQuery', () => ({
	useLessonsQuery: (...args: [FetchLessonsParams, number, boolean]) =>
		mockUseLessonsQuery(...args),
}));

vi.mock('@/utils/setScrollTo', () => ({
	scrollToTop: () => mockScrollToTop(),
}));

vi.mock('next/navigation', () => ({
	useSearchParams: () => mockSearchParams,
	useRouter: () => ({ push: mockPush }),
}));

vi.mock('@/store/filterStore', () => ({
	useFilterStore: (selector: (state: Record<string, unknown>) => unknown) =>
		selector({
			setAllFilters: mockSetAllFilters,
			resetFilters: mockResetFilters,
			getFetchLessonsParams: () => ({ sort: 'LATEST' }),
			selectedSort: mockSelectedSort,
			setSelectedSort: mockSetSelectedSort,
		}),
}));

vi.mock('@/components/features/lessons/LessonFilterSection', () => ({
	LessonFilterSection: ({
		onSearch,
		onReset,
	}: {
		onSearch?: (params: FetchLessonsParams) => void;
		onReset?: () => void;
	}) => (
		<div>
			<button
				type="button"
				onClick={() =>
					onSearch?.({
						regionId: [1, 2],
						subCategoryId: [10, 11],
						sort: 'LIKES',
					})
				}
			>
				trigger-search
			</button>
			<button type="button" onClick={onReset}>
				trigger-reset
			</button>
		</div>
	),
}));

vi.mock('@/components/common/PaginationComponent', () => ({
	default: ({
		page,
		totalPages,
		setPage,
	}: {
		page: number;
		totalPages: number;
		setPage: (value: number) => void;
	}) => (
		<div>
			<div data-testid="pagination-props">{`${page}/${totalPages}`}</div>
			<button type="button" onClick={() => setPage(3)}>
				trigger-page
			</button>
		</div>
	),
}));

vi.mock('@/components/features/lessons/LessonCard', () => ({
	LessonCard: ({ lesson }: { lesson: Lesson }) => <div>{lesson.title}</div>,
}));

vi.mock('@/components/ui/select', () => ({
	Select: ({
		value,
		onValueChange,
		children,
	}: {
		value: string;
		onValueChange: (value: string) => void;
		children: ReactNode;
	}) => (
		<select
			data-testid="sort-select"
			value={value}
			onChange={(event) => onValueChange(event.target.value)}
		>
			{children}
		</select>
	),
	SelectContent: ({ children }: { children: ReactNode }) => <>{children}</>,
	SelectItem: ({ value, children }: { value: string; children: ReactNode }) => (
		<option value={value}>{children}</option>
	),
	SelectTrigger: ({ children }: { children: ReactNode }) => <>{children}</>,
	SelectValue: () => null,
}));

describe('LessonsClient', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockSearchParams = new URLSearchParams();
		mockSelectedSort = null;
		mockQueryResult = {
			data: LESSON_LIST_RESPONSE,
			isLoading: false,
			isError: false,
		};

		mockUseLessonsQuery.mockImplementation(
			(_params: FetchLessonsParams, _page: number, _enabled: boolean) => mockQueryResult,
		);
	});

	it('parses URL query and hydrates filter store values', async () => {
		mockSearchParams = new URLSearchParams(
			'categoryId=10&subCategoryId=11&regionId=1,2&days=WEEKDAY&level=BEGINNER&status=ACTIVE',
		);

		render(<LessonsClient />);

		await waitFor(() => {
			expect(mockSetAllFilters).toHaveBeenCalled();
		});

		const filters = mockSetAllFilters.mock.calls[0][0] as Record<string, unknown>;
		expect(filters.activeMainCategoryId).toBe(10);
		expect(filters.selectedSubCategoryIds).toEqual([11]);
		expect(filters.selectedRegions).toEqual(['1', '2']);
		expect(filters.selectedDays).toEqual([REVERSE_DAYS_MAP.WEEKDAY]);
		expect(filters.selectedDifficulty).toEqual([LEVEL_MAP.BEGINNER]);
		expect(filters.selectedStatus).toBe('ACTIVE');
	});

	it('serializes search filters with comma format on search click', async () => {
		render(<LessonsClient />);
		await userEvent.click(screen.getByRole('button', { name: 'trigger-search' }));

		expect(mockPush).toHaveBeenCalledTimes(1);
		const pushedUrl = mockPush.mock.calls[0][0] as string;
		expect(pushedUrl).toContain('/lessons?');
		expect(pushedUrl).toContain('regionId=1%2C2');
		expect(pushedUrl).toContain('subCategoryId=10%2C11');
		expect(pushedUrl).toContain('sort=LIKES');
		expect(pushedUrl).toContain('page=1');
	});

	it('keeps query and only updates page on pagination action', async () => {
		mockSearchParams = new URLSearchParams('sort=LIKES&regionId=1,2&page=1');
		render(<LessonsClient />);

		await userEvent.click(screen.getByRole('button', { name: 'trigger-page' }));

		expect(mockPush).toHaveBeenCalledTimes(1);
		expect(mockPush.mock.calls[0][0]).toBe('/lessons?sort=LIKES&regionId=1%2C2&page=3');
	});

	it('resets filters and navigates to base lessons route', async () => {
		render(<LessonsClient />);

		await userEvent.click(screen.getByRole('button', { name: 'trigger-reset' }));

		expect(mockResetFilters).toHaveBeenCalledTimes(1);
		expect(mockPush).toHaveBeenCalledWith('/lessons');
	});
});
