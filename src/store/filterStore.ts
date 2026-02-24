import { create } from 'zustand';

import { DAYS_MAP } from '@/constants/dayConstants';
import { REVERSE_LEVEL_MAP } from '@/constants/lessonConstants';
import type { SortEnum } from '@/constants/sortConstants';
import type { FetchLessonsParams, LessonStatus } from '@/models/lesson.model';

export interface FilterState {
	selectedPersonnel: string;
	timeRange: [number, number];
	priceRange: [number, number];
	selectedRegions: string[];
	selectedDays: string[];
	selectedDifficulty: string[];
	selectedStatus: LessonStatus | null;
	selectedSort: SortEnum | null;
	selectedCategories: string[];
	selectedSubCategoryIds: number[];
	activeMainCategoryId: number | null;
	selectedMainCategory: string | null;
	keyword?: string;
	isLiked?: boolean;
	finishedFilter?: boolean;
	limit?: number;

	setSelectedPersonnel: (value: string) => void;
	setTimeRange: (value: [number, number]) => void;
	setPriceRange: (value: [number, number]) => void;
	setSelectedRegions: (regions: string[]) => void;
	setSelectedDays: (days: string[]) => void;
	setSelectedDifficulty: (difficulty: string[]) => void;

	toggleRegion: (region: string) => void;
	toggleDay: (days: string[]) => void;
	toggleDifficulty: (difficulty: string[]) => void;
	toggleFilterArray: (key: keyof FilterState, value: string) => void;
	toggleStatus: (status: LessonStatus | null) => void;
	setSelectedSort: (sort: SortEnum | null) => void;

	selectMainCategory: (category: { id: number; name: string }) => void;
	toggleSubCategory: (subCategory: string, subCategoryId?: number) => void;
	removeCategoryBadge: (category: string) => void;

	resetCategories: () => void;
	resetFilters: () => void;
	setAllFilters: (filters: Partial<FilterState>) => void;
	regionIdMap: Map<string, number>;
	categoryIdMap: Map<string, number>;
	subCategoryIdMap: Map<string, number>;
	setRegionIdMap: (map: Map<string, number>) => void;
	setCategoryIdMap: (map: Map<string, number>) => void;
	setSubCategoryIdMap: (map: Map<string, number>) => void;
	getFetchLessonsParams: () => FetchLessonsParams;
}

const INITIAL_STATE = {
	selectedPersonnel: '',
	timeRange: [0, 24] as [number, number],
	priceRange: [0, 500000] as [number, number],
	selectedRegions: [],
	selectedDays: [],
	selectedDifficulty: [],
	selectedStatus: null,
	selectedSort: null,
	selectedCategories: [],
	selectedSubCategoryIds: [],
	activeMainCategoryId: null,
	selectedMainCategory: null,
	keyword: undefined,
	isLiked: undefined,
	finishedFilter: undefined,
	limit: undefined,
	regionIdMap: new Map<string, number>(),
	categoryIdMap: new Map<string, number>(),
	subCategoryIdMap: new Map<string, number>(),
};

export const useFilterStore = create<FilterState>((set, get) => ({
	...INITIAL_STATE,

	setSelectedPersonnel: (value) => set({ selectedPersonnel: value }),
	setTimeRange: (value) => set({ timeRange: value }),
	setPriceRange: (value) => set({ priceRange: value }),
	setRegionIdMap: (map) => set({ regionIdMap: map }),
	setCategoryIdMap: (map) => set({ categoryIdMap: map }),
	setSubCategoryIdMap: (map) => set({ subCategoryIdMap: map }),
	setSelectedRegions: (regions) => set({ selectedRegions: regions }),
	setSelectedDays: (days) => set({ selectedDays: days }),
	setSelectedDifficulty: (difficulty) => set({ selectedDifficulty: difficulty }),
	setSelectedSort: (sort) => set({ selectedSort: sort }),

	toggleRegion: (region) =>
		set((state) => {
			const current = state.selectedRegions;
			if (region === '전체') {
				return { selectedRegions: current.includes('전체') ? [] : ['전체'] };
			}
			const withoutAll = current.filter((r) => r !== '전체');
			if (withoutAll.includes(region)) {
				return { selectedRegions: withoutAll.filter((r) => r !== region) };
			}
			return { selectedRegions: [...withoutAll, region] };
		}),

	toggleDay: (days) => set({ selectedDays: days }),
	toggleDifficulty: (difficulty) => set({ selectedDifficulty: difficulty }),

	toggleFilterArray: (key, value) =>
		set((state) => {
			const currentSelection = state[key] as string[];
			if (value === '전체') {
				return { [key]: currentSelection.includes('전체') ? [] : ['전체'] };
			}
			const withoutAll = currentSelection.filter((item) => item !== '전체');
			if (withoutAll.includes(value)) {
				return { [key]: withoutAll.filter((item) => item !== value) };
			}
			return { [key]: [...withoutAll, value] };
		}),

	selectMainCategory: (category) =>
		set((state) => {
			if (state.selectedMainCategory === category.name) {
				return {
					selectedMainCategory: null,
					activeMainCategoryId: null,
					selectedCategories: [],
					selectedSubCategoryIds: [],
				};
			}
			return {
				selectedMainCategory: category.name,
				activeMainCategoryId: category.id,
				selectedCategories: [category.name],
				selectedSubCategoryIds: [],
			};
		}),

	toggleSubCategory: (subCategory, subCategoryId) =>
		set((state) => {
			if (!state.selectedMainCategory) return state;
			const currentSub = state.selectedCategories.filter(
				(category) => category !== state.selectedMainCategory,
			);
			const newSub = currentSub.includes(subCategory)
				? currentSub.filter((category) => category !== subCategory)
				: [...currentSub, subCategory];

			const currentSubIds =
				subCategoryId === undefined
					? state.selectedSubCategoryIds
					: state.selectedSubCategoryIds.includes(subCategoryId)
						? state.selectedSubCategoryIds.filter((id) => id !== subCategoryId)
						: [...state.selectedSubCategoryIds, subCategoryId];

			return {
				selectedCategories: [state.selectedMainCategory, ...newSub],
				selectedSubCategoryIds: currentSubIds,
			};
		}),

	removeCategoryBadge: (category) =>
		set((state) => {
			if (category === state.selectedMainCategory) {
				return {
					selectedMainCategory: null,
					activeMainCategoryId: null,
					selectedCategories: [],
					selectedSubCategoryIds: [],
				};
			}

			const removedSubCategoryId = state.subCategoryIdMap.get(category);

			return {
				selectedCategories: state.selectedCategories.filter(
					(selectedCategory) => selectedCategory !== category,
				),
				selectedSubCategoryIds:
					removedSubCategoryId === undefined
						? state.selectedSubCategoryIds
						: state.selectedSubCategoryIds.filter((id) => id !== removedSubCategoryId),
			};
		}),

	toggleStatus: (status) =>
		set((state) => {
			if (state.selectedStatus === status) {
				return { selectedStatus: null };
			}
			return { selectedStatus: status };
		}),

	resetCategories: () =>
		set({
			selectedCategories: INITIAL_STATE.selectedCategories,
			selectedSubCategoryIds: INITIAL_STATE.selectedSubCategoryIds,
			activeMainCategoryId: INITIAL_STATE.activeMainCategoryId,
			selectedMainCategory: INITIAL_STATE.selectedMainCategory,
		}),

	resetFilters: () => set(INITIAL_STATE),
	setAllFilters: (filters) => set(filters),

	getFetchLessonsParams: () => {
		const state = get();
		const params: FetchLessonsParams = {};

		if (state.selectedRegions.length > 0 && !state.selectedRegions.includes('전체')) {
			const regionIds = state.selectedRegions
				.map((name) => state.regionIdMap.get(name))
				.filter((id): id is number => id !== undefined);
			if (regionIds.length > 0) {
				params.regionId = regionIds;
			}
		}

		if (state.activeMainCategoryId) {
			params.categoryId = state.activeMainCategoryId;
		}

		if (state.selectedSubCategoryIds.length > 0) {
			params.subCategoryId = state.selectedSubCategoryIds;
		}

		if (state.selectedDifficulty.length > 0) {
			params.level = state.selectedDifficulty
				.map((difficulty) => REVERSE_LEVEL_MAP[difficulty])
				.filter(Boolean);
		}

		if (state.selectedDays.length > 0) {
			params.days = state.selectedDays.map((day) => DAYS_MAP[day]).filter(Boolean);
		}

		if (state.timeRange[0] !== 0 || state.timeRange[1] !== 24) {
			params.timeRange = `${state.timeRange[0].toString().padStart(2, '0')}-${state.timeRange[1].toString().padStart(2, '0')}`;
		}

		if (state.priceRange[0] !== 0) {
			params.minPrice = state.priceRange[0];
		}
		if (state.priceRange[1] !== 500000) {
			params.maxPrice = state.priceRange[1];
		}

		if (state.selectedStatus !== null) {
			params.status = state.selectedStatus;
		}

		if (
			state.selectedPersonnel &&
			state.selectedPersonnel !== INITIAL_STATE.selectedPersonnel
		) {
			const personnelValueStr = state.selectedPersonnel.replace(/[^0-9]/g, '');
			const maxParticipantsNum = parseInt(personnelValueStr, 10);

			if (!isNaN(maxParticipantsNum)) {
				params.maxParticipants = maxParticipantsNum;
			}
		}

		if (state.selectedSort !== null) {
			params.sort = state.selectedSort;
		}

		if (state.keyword && state.keyword.trim().length > 0) {
			params.keyword = state.keyword.trim();
		}

		if (state.isLiked !== undefined) {
			params.isLiked = state.isLiked;
		}

		if (state.finishedFilter !== undefined) {
			params.finishedFilter = state.finishedFilter;
		}

		if (state.limit !== undefined) {
			params.limit = state.limit;
		}

		return params;
	},
}));
