import { create } from "zustand";

// 상태 타입 정의
interface FilterState {
  selectedPersonnel: string;
  timeRange: [number, number];
  priceRange: [number, number];
  selectedRegions: string[];
  selectedDays: string[];
  selectedDifficulty: string[];
  // 카테고리 관련
  selectedCategories: string[];
  activeMainCategoryId: number | null;
  selectedMainCategory: string | null;

  // Setter
  setSelectedPersonnel: (value: string) => void;
  setTimeRange: (value: [number, number]) => void;
  setPriceRange: (value: [number, number]) => void;

  // 토글
  toggleRegion: (region: string) => void;
  toggleDay: (days: string[]) => void;
  toggleDifficulty: (difficulty: string[]) => void;

  // 카테고리 로직 통합
  selectMainCategory: (category: { id: number; name: string }) => void;
  toggleSubCategory: (subCategory: string) => void;
  removeCategoryBadge: (category: string) => void;

  resetFilters: () => void;
  setAllFilters: (filters: Partial<FilterState>) => void;
}

const INITIAL_STATE = {
  selectedPersonnel: "",
  timeRange: [0, 24] as [number, number],
  priceRange: [0, 500000] as [number, number],
  selectedRegions: [],
  selectedDays: [],
  selectedDifficulty: [],
  selectedCategories: [],
  activeMainCategoryId: null,
  selectedMainCategory: null,
};

export const useFilterStore = create<FilterState>((set) => ({
  ...INITIAL_STATE,

  setSelectedPersonnel: (value) => set({ selectedPersonnel: value }),
  setTimeRange: (value) => set({ timeRange: value }),
  setPriceRange: (value) => set({ priceRange: value }),

  // 지역 토글 로직
  toggleRegion: (region) =>
    set((state) => {
      const current = state.selectedRegions;
      if (region === "전체") {
        return { selectedRegions: current.includes("전체") ? [] : ["전체"] };
      }
      const withoutAll = current.filter((r) => r !== "전체");
      if (withoutAll.includes(region)) {
        return { selectedRegions: withoutAll.filter((r) => r !== region) };
      }
      return { selectedRegions: [...withoutAll, region] };
    }),

  toggleDay: (days) => set({ selectedDays: days }),
  toggleDifficulty: (difficulty) => set({ selectedDifficulty: difficulty }),

  // 카테고리 로직
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
        selectedCategories: state.selectedCategories.filter(
          (c) => c !== category,
        ),
      };
    }),

  resetFilters: () => set(INITIAL_STATE),
  setAllFilters: (filters) => set((state) => ({ ...state, ...filters })),
}));
