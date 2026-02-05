import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { DualRangeSlider } from "@/components/common/DualRangeSlider";
import { REGIONS } from "@/constants/regions";

import { CategoryFilter } from "@/components/features/lessons/CategoryFilter";
import { FilterToggleGroup } from "@/components/common/FilterToggleGroup";
import { FilterBadges } from "@/components/features/lessons/FilterBadges";

import { useFilterStore } from "@/store/filterStore";
import { SUB_CLASS_CATEGORIES } from "@/mock/mockData/categoryMock";

interface LessonFilterSectionProps {
  onClose?: () => void;
  showCloseButton?: boolean;
  onSearch?: () => void;
  onReset?: () => void;
}

export const LessonFilterSection: React.FC<LessonFilterSectionProps> = ({
  onClose,
  showCloseButton = true,
  onSearch,
  onReset,
}) => {
  const {
    // 상태
    selectedRegions,
    selectedPersonnel,
    timeRange,
    priceRange,
    selectedDays,
    selectedDifficulty,
    selectedCategories,
    activeMainCategoryId,
    selectedMainCategory,

    // 액션
    toggleRegion,
    setSelectedPersonnel,
    setTimeRange,
    setPriceRange,
    toggleDay,
    toggleDifficulty,
    selectMainCategory,
    toggleSubCategory,
    removeCategoryBadge,
    resetFilters,
  } = useFilterStore();

  // 렌더링 함수

  const getRegionButtonText = () => {
    if (!selectedRegions.length) return "지역을 선택하세요";
    if (selectedRegions.includes("전체")) return "전체 지역";
    if (selectedRegions.length > 3)
      return `지역 (${selectedRegions.length}개 선택됨)`;
    return selectedRegions.join(", ");
  };

  const getCategoryButtonText = (mainCategory: string | null) => {
    if (!mainCategory) return "카테고리를 선택하세요";
    const subSelectionsCount = Math.max(0, selectedCategories.length - 1);
    if (subSelectionsCount > 0)
      return `${mainCategory} 외 ${subSelectionsCount}개`;
    return mainCategory;
  };

  // 소분류 목록 계산 (Memoization은 store 내부에서 처리하거나 여기서 처리)
  const currentSubCategories = activeMainCategoryId
    ? SUB_CLASS_CATEGORIES.filter(
        (subCat) => subCat.category_id === activeMainCategoryId,
      ).map((subCat) => ({
        id: subCat.id,
        name: subCat.name,
        categoryId: subCat.category_id,
      }))
    : [];

  return (
    <section className="w-full py-8 px-4 md:px-8">
      {/* 중간: 필터 영역 */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-4 mb-4 p-4 border rounded-md bg-gray-50">
        {/* 왼쪽 열 */}
        <div className="flex flex-col gap-2">
          {/* 1. 지역 필터 */}
          <div className="p-2 border rounded-md bg-white flex flex-row items-center gap-6">
            <label className="block text-lg font-bold text-gray-700 min-w-[70px]">
              지역
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[180px] justify-start">
                  {getRegionButtonText()}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <div className="grid grid-cols-3 gap-4 p-4">
                  {/* 전체 버튼 */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="region-all"
                      checked={selectedRegions.includes("전체")}
                      onCheckedChange={() => toggleRegion("전체")}
                    />
                    <label htmlFor="region-all" className="text-sm font-medium">
                      전체
                    </label>
                  </div>
                  {/* 개별 지역 */}
                  {REGIONS.map((region) => (
                    <div
                      key={region.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`region-${region.id}`}
                        checked={selectedRegions.includes(region.name)}
                        onCheckedChange={() => toggleRegion(region.name)}
                      />
                      <label
                        htmlFor={`region-${region.id}`}
                        className="text-sm font-medium"
                      >
                        {region.name}
                      </label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* 2. 카테고리 필터 */}
          <CategoryFilter
            selectedCategories={selectedCategories}
            activeMainCategoryId={activeMainCategoryId}
            selectedMainCategory={selectedMainCategory}
            handleMainCategoryClick={selectMainCategory}
            handleSubCategoryCheckedChange={toggleSubCategory}
            getCategoryButtonText={getCategoryButtonText}
            currentSubCategories={currentSubCategories}
          />

          {/* 3. 요일 필터 */}
          <FilterToggleGroup
            label="요일"
            options={["평일", "토요일", "일요일"]}
            value={selectedDays}
            onValueChange={toggleDay}
          />

          {/* 4. 난이도 필터 */}
          <FilterToggleGroup
            label="난이도"
            options={["입문", "중급", "고급"]}
            value={selectedDifficulty}
            onValueChange={toggleDifficulty}
          />
        </div>

        {/* 오른쪽 열 */}
        <div className="flex flex-col gap-2">
          {/* 5. 인원 필터 */}
          <div className="p-2 border rounded-md bg-white flex flex-row items-center gap-6">
            <label className="block text-lg font-bold text-gray-700 min-w-[70px]">
              인원
            </label>
            <Select
              value={selectedPersonnel}
              onValueChange={setSelectedPersonnel}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="인원을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <SelectItem key={num} value={String(num)}>
                    {num}명
                  </SelectItem>
                ))}
                <SelectItem value="10+">10명 이상</SelectItem>
                <SelectItem value="20+">20명 이상</SelectItem>
                <SelectItem value="30+">30명 이상</SelectItem>
                <SelectItem value="40+">40명 이상</SelectItem>
                <SelectItem value="50+">50명 이상</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 6. 시간 필터 */}
          <div className="p-2 border rounded-md bg-white flex flex-row items-center gap-6">
            <label className="block text-lg font-bold text-gray-700 min-w-[70px]">
              시간
            </label>
            <DualRangeSlider
              min={0}
              max={24}
              step={1}
              value={timeRange}
              onValueChange={setTimeRange}
              formatLabel={(value) => `${value}:00`}
              className="flex-grow"
            />
          </div>

          {/* 7. 금액 필터 */}
          <div className="p-2 border rounded-md bg-white flex flex-row items-center gap-6">
            <label className="block text-lg font-bold text-gray-700 min-w-[70px]">
              금액
            </label>
            <DualRangeSlider
              min={0}
              max={500000}
              step={10000}
              value={priceRange}
              onValueChange={setPriceRange}
              formatLabel={(value) => value.toLocaleString()}
              className="flex-grow"
            />
          </div>
        </div>
      </div>

      {/* 배지 영역 */}
      <FilterBadges
        regions={selectedRegions}
        categories={selectedCategories.slice(1)}
        onRemoveRegion={(region) => toggleRegion(region)}
        onRemoveCategory={removeCategoryBadge}
      />

      {/* 하단 버튼 */}
      <div className="flex justify-end gap-2">
        {showCloseButton && (
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
        )}
        <Button
          variant="outline"
          onClick={onReset || resetFilters} // 클래스 조회 페이지일 경우 조회 결과 초기화도 진행
          className="px-6"
        >
          초기화
        </Button>
        <Button onClick={onSearch} className="px-8 font-bold">
          검색
        </Button>
      </div>
    </section>
  );
};

export default LessonFilterSection;
