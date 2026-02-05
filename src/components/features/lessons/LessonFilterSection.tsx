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
import { useLessonFilters } from "@/hooks/useLessonFilters";

// 훅의 리턴 타입을 Props 타입으로 사용하여 유지보수 자동화
interface LessonFilterSectionProps extends ReturnType<typeof useLessonFilters> {
  onClose?: () => void;
  showCloseButton?: boolean;
  onSearch?: () => void;
}

// -- [Sub Component] 지역 필터 --
const RegionFilter = ({
  selectedRegions,
  getRegionButtonText,
  handleCheckedChange,
  setSelectedRegions,
}: Pick<
  LessonFilterSectionProps,
  | "selectedRegions"
  | "getRegionButtonText"
  | "handleCheckedChange"
  | "setSelectedRegions"
>) => (
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
          <div className="flex items-center space-x-2">
            <Checkbox
              id="region-all"
              checked={selectedRegions.includes("전체")}
              onCheckedChange={() =>
                handleCheckedChange(selectedRegions, setSelectedRegions, "전체")
              }
            />
            <label htmlFor="region-all" className="text-sm font-medium">
              전체
            </label>
          </div>
          {REGIONS.map((region) => (
            <div key={region.id} className="flex items-center space-x-2">
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
);

// -- [Sub Component] 인원 필터 --
const PersonnelFilter = ({
  selectedPersonnel,
  setSelectedPersonnel,
}: Pick<
  LessonFilterSectionProps,
  "selectedPersonnel" | "setSelectedPersonnel"
>) => (
  <div className="p-2 border rounded-md bg-white flex flex-row items-center gap-6">
    <label className="block text-lg font-bold text-gray-700 min-w-[70px]">
      인원
    </label>
    <Select value={selectedPersonnel} onValueChange={setSelectedPersonnel}>
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
);

// -- [Main Component] --
export const LessonFilterSection: React.FC<LessonFilterSectionProps> = (
  props,
) => {
  const {
    // UI Props
    onClose,
    showCloseButton = true,
    onSearch,
    // Hook Values (Destructuring for easy access)
    selectedRegions,
    setSelectedRegions,
    getRegionButtonText,
    handleCheckedChange,
    selectedCategories,
    activeMainCategoryId,
    selectedMainCategory,
    handleMainCategoryClick,
    handleSubCategoryCheckedChange,
    getCategoryButtonText,
    currentSubCategories,
    selectedDays,
    setSelectedDays,
    selectedDifficulty,
    setSelectedDifficulty,
    selectedPersonnel,
    setSelectedPersonnel,
    timeRange,
    setTimeRange,
    priceRange,
    setPriceRange,
    handleResetFilters,
    handleRemoveRegionBadge,
    handleRemoveCategoryBadge,
  } = props;

  return (
    <section className="w-full py-8 px-4 md:px-8">
      <div className="grid grid-cols-2 gap-x-4 gap-y-4 mb-4 p-4 border rounded-md bg-gray-50">
        {/* 왼쪽 열 */}
        <div className="flex flex-col gap-2">
          <RegionFilter
            selectedRegions={selectedRegions}
            getRegionButtonText={getRegionButtonText}
            handleCheckedChange={handleCheckedChange}
            setSelectedRegions={setSelectedRegions}
          />

          <CategoryFilter
            selectedCategories={selectedCategories}
            activeMainCategoryId={activeMainCategoryId}
            selectedMainCategory={selectedMainCategory}
            handleMainCategoryClick={handleMainCategoryClick}
            handleSubCategoryCheckedChange={handleSubCategoryCheckedChange}
            getCategoryButtonText={getCategoryButtonText}
            currentSubCategories={currentSubCategories}
          />

          <FilterToggleGroup
            label="요일"
            options={["평일", "토요일", "일요일"]}
            value={selectedDays}
            onValueChange={setSelectedDays}
          />

          <FilterToggleGroup
            label="난이도"
            options={["입문", "중급", "고급"]}
            value={selectedDifficulty}
            onValueChange={setSelectedDifficulty}
          />
        </div>

        {/* 오른쪽 열 */}
        <div className="flex flex-col gap-2">
          <PersonnelFilter
            selectedPersonnel={selectedPersonnel}
            setSelectedPersonnel={setSelectedPersonnel}
          />

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

      <FilterBadges
        regions={selectedRegions}
        categories={selectedCategories.slice(1)}
        onRemoveRegion={handleRemoveRegionBadge}
        onRemoveCategory={handleRemoveCategoryBadge}
      />

      <div className="flex justify-end gap-2">
        {showCloseButton && (
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
        )}
        <Button variant="outline" onClick={handleResetFilters}>
          초기화
        </Button>
        <Button onClick={onSearch}>검색</Button>
      </div>
    </section>
  );
};

export default LessonFilterSection;
