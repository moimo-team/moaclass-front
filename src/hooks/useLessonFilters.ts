import { useState } from "react";
import { useCategoryFilter } from "@/hooks/useCategoryFilter";

const INITIAL_FILTERS = {
  PERSONNEL: "",
  TIME_RANGE: [0, 24] as [number, number],
  PRICE_RANGE: [0, 500000] as [number, number],
  REGIONS: [] as string[],
  DAYS: [] as string[],
  DIFFICULTY: [] as string[],
};

export const useLessonFilters = () => {
  const [selectedPersonnel, setSelectedPersonnel] = useState<string>(
    INITIAL_FILTERS.PERSONNEL,
  );
  const [timeRange, setTimeRange] = useState<[number, number]>(
    INITIAL_FILTERS.TIME_RANGE,
  );
  const [priceRange, setPriceRange] = useState<[number, number]>(
    INITIAL_FILTERS.PRICE_RANGE,
  );
  const [selectedRegions, setSelectedRegions] = useState<string[]>(
    INITIAL_FILTERS.REGIONS,
  );
  const [selectedDays, setSelectedDays] = useState<string[]>(
    INITIAL_FILTERS.DAYS,
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>(
    INITIAL_FILTERS.DIFFICULTY,
  );

  const categoryFilter = useCategoryFilter();

  const handleResetFilters = () => {
    setSelectedPersonnel(INITIAL_FILTERS.PERSONNEL);
    setTimeRange(INITIAL_FILTERS.TIME_RANGE);
    setPriceRange(INITIAL_FILTERS.PRICE_RANGE);
    setSelectedRegions(INITIAL_FILTERS.REGIONS);
    setSelectedDays(INITIAL_FILTERS.DAYS);
    setSelectedDifficulty(INITIAL_FILTERS.DIFFICULTY);
    categoryFilter.resetCategories();
  };

  const handleRemoveRegionBadge = (regionName: string) => {
    if (selectedRegions.includes("전체") && regionName !== "전체") {
      setSelectedRegions((prev) =>
        prev.filter((item) => item !== regionName && item !== "전체"),
      );
    } else {
      setSelectedRegions((prev) => prev.filter((item) => item !== regionName));
    }
  };

  const handleCheckedChange = (
    currentSelection: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    value: string,
  ) => {
    if (value === "전체") {
      setter(currentSelection.includes("전체") ? [] : ["전체"]);
    } else {
      const withoutAll = currentSelection.filter((item) => item !== "전체");
      if (withoutAll.includes(value)) {
        setter(withoutAll.filter((item) => item !== value));
      } else {
        setter([...withoutAll, value]);
      }
    }
  };

  const getRegionButtonText = (regions: string[]) => {
    if (!regions.length) return "지역을 선택하세요";
    if (regions.includes("전체")) return "전체 지역";
    if (regions.length > 3) return `지역 (${regions.length}개 선택됨)`;
    return regions.join(", ");
  };

  return {
    selectedPersonnel,
    setSelectedPersonnel,
    timeRange,
    setTimeRange,
    priceRange,
    setPriceRange,
    selectedRegions,
    setSelectedRegions,
    selectedDays,
    setSelectedDays,
    selectedDifficulty,
    setSelectedDifficulty,
    handleResetFilters,
    handleRemoveRegionBadge,
    handleCheckedChange,
    getRegionButtonText,
    ...categoryFilter,
  };
};
