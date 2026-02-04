import { useState } from "react";
import { useCategoryFilter } from "./useCategoryFilter";

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
    // "전체"가 포함된 상태에서 다른 것을 지우면 "전체"도 같이 지우는 로직 유지
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
      // 전체 클릭 시: 이미 전체면 해제, 아니면 전체만 선택
      setter(currentSelection.includes("전체") ? [] : ["전체"]);
    } else {
      // 일반 항목 클릭 시: "전체"는 무조건 제거하고 토글
      const withoutAll = currentSelection.filter((item) => item !== "전체");
      if (withoutAll.includes(value)) {
        setter(withoutAll.filter((item) => item !== value));
      } else {
        setter([...withoutAll, value]);
      }
    }
  };

  // 지역 버튼 텍스트 생성
  const getRegionButtonText = (regions: string[]) => {
    if (!regions.length) return "지역을 선택하세요";
    if (regions.includes("전체")) return "전체 지역";
    if (regions.length > 3) return `지역 (${regions.length}개 선택됨)`;
    return regions.join(", ");
  };

  // 검색 버튼 클릭 핸들러
  const handleSearch = () => {
    let personnelCount = 0;
    if (selectedPersonnel) {
      // "10+" -> 10, "5" -> 5 로 변환
      personnelCount = parseInt(selectedPersonnel.replace(/\D/g, ""), 10);
    }

    const filterQuery = {
      personnel: personnelCount || null,
      timeRange,
      priceRange,
      regions: selectedRegions.includes("전체") ? [] : selectedRegions,
      categories: categoryFilter.selectedCategories,
      days: selectedDays,
      difficulty: selectedDifficulty,
    };

    console.log("필터링 쿼리:", filterQuery);
    // TODO: API 호출
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
    handleSearch,

    ...categoryFilter,
  };
};
