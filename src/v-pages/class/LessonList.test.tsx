import type { ReactNode } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { REVERSE_DAYS_MAP } from '@/constants/dayConstants';
import { LEVEL_MAP } from '@/constants/lessonConstants';
import type { FetchLessonsParams, FetchLessonsResponse, Lesson } from '@/models/lesson.model';
import {
	LESSON_LIST_EMPTY_RESPONSE,
	LESSON_LIST_FIXTURE,
	LESSON_LIST_RESPONSE,
	LESSON_SEARCH_PARAMS,
} from '@/test/fixtures/lessonList.fixture';

import LessonListPage from './LessonList';

const mockSetSearchParams = vi.fn();
const mockSetAllFilters = vi.fn();
const mockResetFilters = vi.fn();
const mockSetSelectedSort = vi.fn();
const mockScrollToTop = vi.fn();
const mockUseLessonsQuery = vi.fn();

const mockFetchParams: FetchLessonsParams = { sort: 'LATEST', categoryId: 1 };
const mockSearchMappedParams: FetchLessonsParams = {
	regionId: [1, 2],
	subCategoryId: [10, 11],
	sort: 'LIKES',
	minPrice: 10000,
	maxPrice: 30000,
};

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

vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual('react-router-dom');
	return {
		...actual,
		useSearchParams: () => [mockSearchParams, mockSetSearchParams] as const,
	};
});

vi.mock('@/store/filterStore', () => ({
	useFilterStore: (selector: (state: Record<string, unknown>) => unknown) =>
		selector({
			setAllFilters: mockSetAllFilters,
			resetFilters: mockResetFilters,
			getFetchLessonsParams: () => mockFetchParams,
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
			<button type="button" onClick={() => onSearch?.(mockSearchMappedParams)}>
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

describe('LessonListPage', () => {
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

	it('parses URL query and applies filter store values', async () => {
		mockSearchParams = new URLSearchParams(LESSON_SEARCH_PARAMS);

		render(<LessonListPage />);

		await waitFor(() => {
			expect(mockSetAllFilters).toHaveBeenCalled();
		});
		const filters = mockSetAllFilters.mock.calls[0][0] as Record<string, unknown>;
		expect(filters.selectedCategories).toEqual([]);
		expect(filters.activeMainCategoryId).toBe(10);
		expect(filters.selectedRegions).toEqual(['1']);
		expect(filters.selectedSort).toBe('LIKES');
		expect(filters.selectedDays).toEqual([REVERSE_DAYS_MAP.WEEKDAY]);
		expect(filters.selectedDifficulty).toEqual([LEVEL_MAP.BEGINNER]);
		expect(filters.selectedStatus).toBe('ACTIVE');
		expect(filters.priceRange).toEqual([10000, 50000]);
	});

	it('calls useLessonsQuery with enabled=false then true during initialization', async () => {
		render(<LessonListPage />);

		await waitFor(() => {
			expect(mockUseLessonsQuery).toHaveBeenCalled();
		});

		const enabledArgs = mockUseLessonsQuery.mock.calls.map((call) => call[2]);
		expect(enabledArgs).toContain(false);
		expect(enabledArgs).toContain(true);
	});

	it('renders lesson cards on success', () => {
		render(<LessonListPage />);

		expect(screen.getByText('클래스 1')).toBeInTheDocument();
		expect(screen.getByText('클래스 2')).toBeInTheDocument();
	});

	it('renders loading state', () => {
		mockQueryResult = { data: undefined, isLoading: true, isError: false };

		render(<LessonListPage />);

		expect(screen.getByText('로딩 중...')).toBeInTheDocument();
	});

	it('renders error state', () => {
		mockQueryResult = { data: undefined, isLoading: false, isError: true };

		render(<LessonListPage />);

		expect(screen.getByText('데이터를 불러오는데 실패했습니다.')).toBeInTheDocument();
	});

	it('renders empty state when result data is empty', () => {
		mockQueryResult = { data: LESSON_LIST_EMPTY_RESPONSE, isLoading: false, isError: false };

		render(<LessonListPage />);

		expect(screen.getByText('조건에 맞는 클래스가 없습니다.')).toBeInTheDocument();
	});

	it('updates query params and resets page to 1 on search', async () => {
		render(<LessonListPage />);
		await userEvent.click(screen.getByRole('button', { name: 'trigger-search' }));

		expect(mockSetSearchParams).toHaveBeenCalledTimes(1);
		const params = mockSetSearchParams.mock.calls[0][0] as URLSearchParams;
		expect(params.get('page')).toBe('1');
		expect(params.get('regionId')).toBe('1,2');
		expect(params.get('subCategoryId')).toBe('10,11');
		expect(params.get('sort')).toBe('LIKES');
		expect(params.get('minPrice')).toBe('10000');
		expect(params.get('maxPrice')).toBe('30000');
	});

	it('resets filters and URL on reset action', async () => {
		render(<LessonListPage />);
		await userEvent.click(screen.getByRole('button', { name: 'trigger-reset' }));

		expect(mockResetFilters).toHaveBeenCalledTimes(1);
		expect(mockSetSearchParams).toHaveBeenCalledWith({});
		expect(mockScrollToTop).toHaveBeenCalledTimes(1);
	});

	it('updates page query on pagination action', async () => {
		render(<LessonListPage />);
		await userEvent.click(screen.getByRole('button', { name: 'trigger-page' }));

		expect(mockSetSearchParams).toHaveBeenCalledTimes(1);
		const params = mockSetSearchParams.mock.calls[0][0] as URLSearchParams;
		expect(params.get('page')).toBe('3');
		expect(mockScrollToTop).toHaveBeenCalledTimes(1);
	});

	it('updates selected sort in filter store', async () => {
		render(<LessonListPage />);
		await userEvent.selectOptions(screen.getByTestId('sort-select'), ['PRICE_ASC']);

		expect(mockSetSelectedSort).toHaveBeenCalledWith('PRICE_ASC');
	});

	it('passes current page and totalPages to pagination component', () => {
		mockSearchParams = new URLSearchParams('page=2');
		mockQueryResult = {
			data: {
				data: LESSON_LIST_FIXTURE,
				meta: { totalCount: 20, page: 2, limit: 10, totalPages: 5 },
			},
			isLoading: false,
			isError: false,
		};

		render(<LessonListPage />);

		expect(screen.getByTestId('pagination-props')).toHaveTextContent('2/5');
	});

	it('uses page=1 by default when URL has no page query', async () => {
		render(<LessonListPage />);

		await waitFor(() => {
			expect(mockUseLessonsQuery).toHaveBeenCalled();
		});
		const latestCall = mockUseLessonsQuery.mock.calls.at(-1);
		expect(latestCall[1]).toBe(1);
	});
});
