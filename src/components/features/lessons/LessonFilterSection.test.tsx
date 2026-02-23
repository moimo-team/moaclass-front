import type { ReactNode } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LessonFilterSection } from '@/components/features/lessons/LessonFilterSection';

const mockToggleStatus = vi.fn();
const mockSetAllFilters = vi.fn();
const mockSetRegionIdMap = vi.fn();
const mockSetCategoryIdMap = vi.fn();
const mockSetSubCategoryIdMap = vi.fn();

const mockStoreState = {
	selectedRegions: ['1'],
	selectedPersonnel: '',
	timeRange: [0, 24] as [number, number],
	priceRange: [0, 500000] as [number, number],
	selectedDays: [],
	selectedDifficulty: [],
	selectedCategories: ['Main', 'Sub'],
	selectedSubCategoryIds: [],
	activeMainCategoryId: null as number | null,
	selectedMainCategory: null as string | null,
	selectedStatus: null as 'ACTIVE' | 'INACTIVE' | null,
	toggleStatus: mockToggleStatus,
	toggleRegion: vi.fn(),
	setSelectedPersonnel: vi.fn(),
	setTimeRange: vi.fn(),
	setPriceRange: vi.fn(),
	toggleDay: vi.fn(),
	toggleDifficulty: vi.fn(),
	selectMainCategory: vi.fn(),
	toggleSubCategory: vi.fn(),
	removeCategoryBadge: vi.fn(),
	resetFilters: vi.fn(),
	setAllFilters: mockSetAllFilters,
	getFetchLessonsParams: vi.fn(() => ({})),
	setRegionIdMap: mockSetRegionIdMap,
	setCategoryIdMap: mockSetCategoryIdMap,
	subCategoryIdMap: new Map<string, number>(),
	setSubCategoryIdMap: mockSetSubCategoryIdMap,
};

const mockFilterBadges = vi.fn();

vi.mock('@/store/filterStore', () => ({
	useFilterStore: (selector?: (state: typeof mockStoreState) => unknown) =>
		selector ? selector(mockStoreState) : mockStoreState,
}));

vi.mock('@/hooks/useRegionQuery', () => ({
	useRegionQuery: () => ({
		data: [{ id: 1, name: '서울' }],
		isLoading: false,
	}),
}));

vi.mock('@/hooks/useCategoryQuery', () => ({
	useCategoryQuery: () => ({
		data: [{ id: 10, name: 'Main' }],
		isLoading: false,
	}),
	useSubCategoryQuery: () => ({
		data: [],
	}),
}));

vi.mock('@/components/features/lessons/CategoryFilter', () => ({
	CategoryFilter: () => <div>CategoryFilter</div>,
}));

vi.mock('@/components/features/lessons/FilterBadges', () => ({
	FilterBadges: (props: Record<string, unknown>) => {
		mockFilterBadges(props);
		return <div>FilterBadges</div>;
	},
}));

vi.mock('@/components/common/FilterToggleGroup', () => ({
	FilterToggleGroup: () => <div>FilterToggleGroup</div>,
}));

vi.mock('@/components/common/DualRangeSlider', () => ({
	DualRangeSlider: () => <div>DualRangeSlider</div>,
}));

vi.mock('@/components/ui/skeleton', () => ({
	Skeleton: () => <div>Skeleton</div>,
}));

vi.mock('@/components/ui/popover', () => ({
	Popover: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	PopoverTrigger: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	PopoverContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/components/ui/checkbox', () => ({
	Checkbox: ({
		checked,
		onCheckedChange,
	}: {
		checked?: boolean;
		onCheckedChange?: () => void;
	}) => <input type="checkbox" checked={checked} onChange={() => onCheckedChange?.()} readOnly />,
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
		<select value={value} onChange={(event) => onValueChange(event.target.value)}>
			{children}
		</select>
	),
	SelectTrigger: ({ children }: { children: ReactNode }) => <>{children}</>,
	SelectValue: () => null,
	SelectContent: ({ children }: { children: ReactNode }) => <>{children}</>,
	SelectItem: ({ value, children }: { value: string; children: ReactNode }) => (
		<option value={value}>{children}</option>
	),
}));

describe('LessonFilterSection', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockStoreState.selectedRegions = ['1'];
		mockStoreState.selectedStatus = null;
	});

	it('passes main category badge together with subcategories', () => {
		render(<LessonFilterSection />);

		expect(mockFilterBadges).toHaveBeenCalled();
		const props = mockFilterBadges.mock.calls[0][0] as { categories: string[] };
		expect(props.categories).toEqual(['Main', 'Sub']);
	});

	it('hydrates numeric region ids to region names after region query resolves', async () => {
		render(<LessonFilterSection />);

		await waitFor(() => {
			expect(mockSetAllFilters).toHaveBeenCalledWith({ selectedRegions: ['서울'] });
		});
	});

	it('uses enum status values for select actions', async () => {
		render(<LessonFilterSection />);

		const selects = screen.getAllByRole('combobox');
		await userEvent.selectOptions(selects[0], ['ACTIVE']);
		await userEvent.selectOptions(selects[0], ['ALL_STATUSES']);

		expect(mockToggleStatus).toHaveBeenCalledWith('ACTIVE');
		expect(mockToggleStatus).toHaveBeenCalledWith(null);
	});
});
