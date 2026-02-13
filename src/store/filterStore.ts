import { create } from 'zustand';

import { DAYS_MAP } from '@/constants/dayConstants';
import { REVERSE_LEVEL_MAP } from '@/constants/lessonConstants';
import type { SortEnum } from '@/constants/sortConstants';
import { STATUS_MAP } from '@/constants/statusConstants';
import type { FetchLessonsParams } from '@/models/lesson.model';

export interface FilterState {
	selectedPersonnel: string;
	timeRange: [number, number];
	priceRange: [number, number];
	selectedRegions: string[];
	selectedDays: string[];
	selectedDifficulty: string[];
	selectedStatus: string | null;
	selectedSort: SortEnum | null;
	selectedCategories: string[];
	activeMainCategoryId: number | null;
	selectedMainCategory: string | null;

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
	toggleStatus: (status: string | null) => void;
	setSelectedSort: (sort: SortEnum | null) => void;

	selectMainCategory: (category: { id: number; name: string }) => void;
	toggleSubCategory: (subCategory: string) => void;
	removeCategoryBadge: (category: string) => void;

	resetCategories: () => void;
	resetFilters: () => void;
	setAllFilters: (filters: Partial<FilterState>) => void;
	regionIdMap: Map<string, number>;
	categoryIdMap: Map<string, number>;
	setRegionIdMap: (map: Map<string, number>) => void;
	setCategoryIdMap: (map: Map<string, number>) => void;
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
	activeMainCategoryId: null,
	selectedMainCategory: null,
	regionIdMap: new Map(),
	categoryIdMap: new Map(),
};

export const useFilterStore = create<FilterState>((set, get) => ({
	...INITIAL_STATE,

	setSelectedPersonnel: (value) => set({ selectedPersonnel: value }),
	setTimeRange: (value) => set({ timeRange: value }),
	setPriceRange: (value) => set({ priceRange: value }),
	setRegionIdMap: (map) => set({ regionIdMap: map }),
	setCategoryIdMap: (map) => set({ categoryIdMap: map }),
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
				};
			}
			return {
				selectedMainCategory: category.name,
				activeMainCategoryId: category.id,
				selectedCategories: [category.name],
			};
		}),

	toggleSubCategory: (subCategory) =>
		set((state) => {
			if (!state.selectedMainCategory) return state;
			const currentSub = state.selectedCategories.filter(
				(c) => c !== state.selectedMainCategory,
			);
			let newSub;
			if (currentSub.includes(subCategory)) {
				newSub = currentSub.filter((c) => c !== subCategory);
			} else {
				newSub = [...currentSub, subCategory];
			}
			return { selectedCategories: [state.selectedMainCategory, ...newSub] };
		}),

	removeCategoryBadge: (category) =>
		set((state) => {
			if (category === state.selectedMainCategory) {
				return {
					selectedMainCategory: null,
					activeMainCategoryId: null,
					selectedCategories: [],
				};
			}
			return {
				selectedCategories: state.selectedCategories.filter((c) => c !== category),
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
			activeMainCategoryId: INITIAL_STATE.activeMainCategoryId,
			selectedMainCategory: INITIAL_STATE.selectedMainCategory,
		}),

	resetFilters: () => set(INITIAL_STATE),
	setAllFilters: (filters) => set((state) => ({ ...state, ...filters })),

	getFetchLessonsParams: () => {
		const state = get();
		const params: FetchLessonsParams = {};

		if (state.selectedRegions.length > 0 && !state.selectedRegions.includes('전체')) {
			const regionIds = state.selectedRegions
				.map((name) => state.regionIdMap.get(name))
				.filter((id) => id !== undefined);
			if (regionIds.length > 0) {
				params.regionId = regionIds;
			}
		}

		if (state.activeMainCategoryId) {
			params.categoryId = state.activeMainCategoryId;
		} else if (state.selectedCategories.length > 0) {
			// TODO: 만약 세분화된 카테고리 ID가 필요하다면 이 로직을 수정해야 함
			// 현재는 activeMainCategoryId만 사용
		}

		if (state.selectedDifficulty.length > 0) {
			params.level = state.selectedDifficulty
				.map((d) => REVERSE_LEVEL_MAP[d])
				.filter(Boolean);
		}

		if (state.selectedDays.length > 0) {
			params.days = state.selectedDays.map((d) => DAYS_MAP[d]).filter(Boolean);
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
			params.status = STATUS_MAP[state.selectedStatus as keyof typeof STATUS_MAP];
		}

		if (
			state.selectedPersonnel &&
			state.selectedPersonnel !== INITIAL_STATE.selectedPersonnel
		) {
			const personnelValueStr = state.selectedPersonnel.replace(/[^0-9]/g, '');
			const maxParticipantsNum = parseInt(personnelValueStr);

			if (!isNaN(maxParticipantsNum)) {
				params.maxParticipants = maxParticipantsNum;
			}
		}

		if (state.selectedSort !== null) {
			params.sort = state.selectedSort;
		}

		return params;
	},
}));
