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

import { useLessonFilters } from "@/hooks/useLessonFilters";
import { CategoryFilter } from "@components/features/lessons/CategoryFilter";
import { FilterToggleGroup } from "@/components/common/FilterToggleGroup";
import { FilterBadges } from "@components/features/lessons/FilterBadges";

interface LessonFilterSectionProps {
  onClose?: () => void;
}

const LessonFilterSection: React.FC<LessonFilterSectionProps> = ({
  onClose,
}) => {
  const {
    selectedPersonnel,
    setSelectedPersonnel,
    timeRange,
    setTimeRange,
    priceRange,
    setPriceRange,
    selectedRegions,
    setSelectedRegions,
    selectedCategories,
    activeMainCategoryId,
    selectedMainCategory,
    handleResetFilters,
    handleRemoveRegionBadge,
    handleRemoveCategoryBadge,
    handleCheckedChange,
    handleMainCategoryClick,
    handleSubCategoryCheckedChange,
    getCategoryButtonText,
    getRegionButtonText,
    currentSubCategories,
    handleSearch,
    CLASS_CATEGORIES,
    selectedDays,
    setSelectedDays,
    selectedDifficulty,
    setSelectedDifficulty,
  } = useLessonFilters();

  return (
    <section className="w-full py-8 px-4 md:px-8">
      {/* 중간: 필터 7개 공간 */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-4 mb-4 p-4 border rounded-md bg-gray-50">
        {/* 왼쪽 열 */}
        <div className="flex flex-col gap-2">
          {/* 지역 필터 */}
          <div className="p-2 border rounded-md bg-white flex flex-row items-center gap-6">
            <label className="block text-lg font-bold text-gray-700 min-w-[70px]">
              지역
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[180px] justify-start">
                  {getRegionButtonText(selectedRegions)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <div className="grid grid-cols-3 gap-4 p-4">
                  <div key="region-all" className="flex items-center space-x-2">
                    <Checkbox
                      id="region-all"
                      checked={selectedRegions.includes("전체")}
                      onCheckedChange={() =>
                        handleCheckedChange(
                          selectedRegions,
                          setSelectedRegions,
                          "전체",
                        )
                      }
                    />
                    <label
                      htmlFor="region-all"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      전체
                    </label>
                  </div>
                  {REGIONS.map((region) => (
                    <div
                      key={region.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`region-${region.id}`}
                        checked={selectedRegions.includes(region.name)}
                        onCheckedChange={() =>
                          handleCheckedChange(
                            selectedRegions,
                            setSelectedRegions,
                            region.name,
                          )
                        }
                      />
                      <label
                        htmlFor={`region-${region.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {region.name}
                      </label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* 카테고리 필터 컴포넌트 */}
          <CategoryFilter
            selectedCategories={selectedCategories}
            activeMainCategoryId={activeMainCategoryId}
            selectedMainCategory={selectedMainCategory}
            handleMainCategoryClick={handleMainCategoryClick}
            handleSubCategoryCheckedChange={handleSubCategoryCheckedChange}
            getCategoryButtonText={getCategoryButtonText}
            currentSubCategories={currentSubCategories}
            CLASS_CATEGORIES={CLASS_CATEGORIES}
          />

          {/* 요일 필터 */}
          <FilterToggleGroup
            label="요일"
            options={["평일", "토요일", "일요일"]}
            value={selectedDays}
            onValueChange={setSelectedDays}
          />

          {/* 난이도 필터  */}
          <FilterToggleGroup
            label="난이도"
            options={["입문", "중급", "고급"]}
            value={selectedDifficulty}
            onValueChange={setSelectedDifficulty}
          />
        </div>

        {/* 오른쪽 열 */}
        <div className="flex flex-col gap-2">
          {/* 인원 필터 */}
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
                <SelectItem value="1">1명</SelectItem>
                <SelectItem value="2">2명</SelectItem>
                <SelectItem value="3">3명</SelectItem>
                <SelectItem value="4">4명</SelectItem>
                <SelectItem value="5">5명</SelectItem>
                <SelectItem value="6">6명</SelectItem>
                <SelectItem value="7">7명</SelectItem>
                <SelectItem value="8">8명</SelectItem>
                <SelectItem value="9">9명</SelectItem>
                <SelectItem value="10+">10명 이상</SelectItem>
                <SelectItem value="20+">20명 이상</SelectItem>
                <SelectItem value="30+">30명 이상</SelectItem>
                <SelectItem value="40+">40명 이상</SelectItem>
                <SelectItem value="50+">50명 이상</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* 시간 필터 */}
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
          {/* 금액 필터 */}
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

      {/* 소분류 배지 표시 공간 */}
      <FilterBadges
        regions={selectedRegions}
        categories={selectedCategories.slice(1)}
        onRemoveRegion={handleRemoveRegionBadge}
        onRemoveCategory={handleRemoveCategoryBadge}
      />

      {/* 하단: 초기화 및 검색 버튼 */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          닫기
        </Button>
        <Button variant="outline" onClick={handleResetFilters}>
          초기화
        </Button>
        <Button onClick={handleSearch}>검색</Button>
      </div>
    </section>
  );
};

export default LessonFilterSection;
