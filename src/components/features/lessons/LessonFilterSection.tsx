import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

// TODO: PR 머지 후 삭제하기
const CLASS_CATEGORIES = [
  {
    id: 1,
    name: "핸드메이드",
  },
  {
    id: 2,
    name: "쿠킹",
  },
  {
    id: 3,
    name: "플라워·가드닝",
  },
  {
    id: 4,
    name: "드로잉",
  },
  {
    id: 5,
    name: "음악",
  },
  {
    id: 6,
    name: "요가·필라테스",
  },
  {
    id: 7,
    name: "레져·스포츠",
  },
  {
    id: 8,
    name: "뷰티",
  },
  {
    id: 9,
    name: "반려동물",
  },
  {
    id: 10,
    name: "체험",
  },
  {
    id: 11,
    name: "자기계발",
  },
  {
    id: 12,
    name: "로컬여행",
  },
];

const SUB_CLASS_CATEGORIES = [
  // 핸드메이드
  {
    id: 1,
    category_id: 1,
    name: "캔들·디퓨저",
  },
  {
    id: 2,
    category_id: 1,
    name: "향수",
  },
  {
    id: 3,
    category_id: 1,
    name: "비누·배쓰밤",
  },
  {
    id: 4,
    category_id: 1,
    name: "위빙·소잉",
  },
  {
    id: 5,
    category_id: 1,
    name: "라탄·마크라메",
  },
  {
    id: 6,
    category_id: 1,
    name: "액세서리",
  },
  {
    id: 7,
    category_id: 1,
    name: "가죽",
  },
  {
    id: 8,
    category_id: 1,
    name: "도자기",
  },
  {
    id: 9,
    category_id: 1,
    name: "목공",
  },
  {
    id: 10,
    category_id: 1,
    name: "레진",
  },
  {
    id: 11,
    category_id: 1,
    name: "디자인·굿즈",
  },
  {
    id: 12,
    category_id: 1,
    name: "업사이클링",
  },
  {
    id: 13,
    category_id: 1,
    name: "기타 공예",
  },
  // 쿠킹
  {
    id: 14,
    category_id: 2,
    name: "베이킹",
  },
  {
    id: 15,
    category_id: 2,
    name: "요리",
  },
  {
    id: 16,
    category_id: 2,
    name: "떡·앙금",
  },
  {
    id: 17,
    category_id: 2,
    name: "디저트·음료",
  },
  {
    id: 18,
    category_id: 2,
    name: "커피·바리스타",
  },
  {
    id: 19,
    category_id: 2,
    name: "기타 쿠킹",
  },
  // 드로잉
  {
    id: 20,
    category_id: 4,
    name: "드로잉",
  },
  {
    id: 21,
    category_id: 4,
    name: "소묘",
  },
  {
    id: 22,
    category_id: 4,
    name: "펜화",
  },
  {
    id: 23,
    category_id: 4,
    name: "캘리그라피",
  },
  {
    id: 24,
    category_id: 4,
    name: "수채화",
  },
  {
    id: 25,
    category_id: 4,
    name: "동양화",
  },
  {
    id: 26,
    category_id: 4,
    name: "서양화",
  },
  {
    id: 27,
    category_id: 4,
    name: "민화",
  },
  {
    id: 28,
    category_id: 4,
    name: "일러스트",
  },
  {
    id: 29,
    category_id: 4,
    name: "유화",
  },
  {
    id: 30,
    category_id: 4,
    name: "아크릴",
  },
  {
    id: 31,
    category_id: 4,
    name: "디지털 드로잉",
  },
  {
    id: 32,
    category_id: 4,
    name: "기타 드로잉",
  },
  // 음악
  {
    id: 33,
    category_id: 5,
    name: "피아노",
  },
  {
    id: 34,
    category_id: 5,
    name: "기타·우쿠렐레",
  },
  {
    id: 35,
    category_id: 5,
    name: "보컬",
  },
  {
    id: 36,
    category_id: 5,
    name: "작사·작곡",
  },
  {
    id: 37,
    category_id: 5,
    name: "프로듀싱",
  },
  {
    id: 38,
    category_id: 5,
    name: "기타 악기",
  },
  // 요가·필라테스
  {
    id: 39,
    category_id: 6,
    name: "요가",
  },
  {
    id: 40,
    category_id: 6,
    name: "필라테스",
  },
  // 레져·스포츠
  {
    id: 41,
    category_id: 7,
    name: "피트니스",
  },
  {
    id: 42,
    category_id: 7,
    name: "실내 운동",
  },
  {
    id: 43,
    category_id: 7,
    name: "야외 운동",
  },
  {
    id: 44,
    category_id: 7,
    name: "댄스",
  },
  {
    id: 45,
    category_id: 7,
    name: "레저",
  },
  {
    id: 46,
    category_id: 7,
    name: "기타 스포츠",
  },
  // 뷰티
  {
    id: 47,
    category_id: 8,
    name: "메이크업",
  },
  {
    id: 48,
    category_id: 8,
    name: "헤어",
  },
  {
    id: 49,
    category_id: 8,
    name: "네일아트",
  },
  {
    id: 50,
    category_id: 8,
    name: "타투",
  },
  {
    id: 51,
    category_id: 8,
    name: "셀프케어",
  },
  // 반려동물
  {
    id: 52,
    category_id: 9,
    name: "펫 푸드",
  },
  {
    id: 53,
    category_id: 9,
    name: "펫 에티켓",
  },
  {
    id: 54,
    category_id: 9,
    name: "펫 액세서리",
  },
  {
    id: 55,
    category_id: 9,
    name: "펫 미용",
  },
  {
    id: 56,
    category_id: 9,
    name: "기타 펫 클래스",
  },
];

interface LessonFilterSectionProps {
  onClose?: () => void;
}

const LessonFilterSection: React.FC<LessonFilterSectionProps> = ({
  onClose,
}) => {
  const [selectedPersonnel, setSelectedPersonnel] = useState<string>("");
  const initialTimeRange: [number, number] = [0, 24];
  const initialPriceRange: [number, number] = [0, 500000];
  const initialRegions: string[] = [];
  const initialCategories: string[] = [];
  const initialActiveMainCategoryId: number | null = null;
  const initialSelectedMainCategory: string | null = null;
  const initialSelectedDays: string[] = [];
  const initialSelectedDifficulty: string[] = [];

  const [timeRange, setTimeRange] =
    useState<[number, number]>(initialTimeRange);
  const [priceRange, setPriceRange] =
    useState<[number, number]>(initialPriceRange);
  const [selectedRegions, setSelectedRegions] =
    useState<string[]>(initialRegions);
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(initialCategories);
  const [activeMainCategoryId, setActiveMainCategoryId] = useState<
    number | null
  >(initialActiveMainCategoryId);
  const [selectedMainCategory, setSelectedMainCategory] = useState<
    string | null
  >(initialSelectedMainCategory);
  const [selectedDays, setSelectedDays] =
    useState<string[]>(initialSelectedDays);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>(
    initialSelectedDifficulty,
  );

  const handleResetFilters = () => {
    setSelectedPersonnel("");
    setTimeRange(initialTimeRange);
    setPriceRange(initialPriceRange);
    setSelectedRegions(initialRegions);
    setSelectedCategories(initialCategories);
    setActiveMainCategoryId(initialActiveMainCategoryId);
    setSelectedMainCategory(initialSelectedMainCategory);
    setSelectedDays(initialSelectedDays);
    setSelectedDifficulty(initialSelectedDifficulty);
  };

  const handleRemoveRegionBadge = (regionName: string) => {
    // '전체'가 선택되어 있으면, 다른 항목 제거 시 '전체'도 제거
    if (selectedRegions.includes("전체") && regionName !== "전체") {
      setSelectedRegions((prev) =>
        prev.filter((item) => item !== regionName && item !== "전체"),
      );
    } else {
      setSelectedRegions((prev) => prev.filter((item) => item !== regionName));
    }
    // 만약 마지막 남은 항목이 '전체'이고, '전체'를 제거하려 한다면
    if (regionName === "전체" && selectedRegions.length === 1) {
      setSelectedRegions([]);
    }
  };

  const handleRemoveCategoryBadge = (categoryName: string) => {
    // 선택된 메인 카테고리 뱃지를 지우면 모두 초기화
    if (categoryName === selectedMainCategory) {
      setSelectedMainCategory(null);
      setActiveMainCategoryId(null);
      setSelectedCategories([]);
    } else {
      // 서브 카테고리 뱃지를 지울 때
      setSelectedCategories((prev) =>
        prev.filter((item) => item !== categoryName),
      );
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
      let newSelection = currentSelection.filter((item) => item !== "전체"); // '전체' 제거
      if (newSelection.includes(value)) {
        newSelection = newSelection.filter((item) => item !== value);
      } else {
        newSelection = [...newSelection, value];
      }
      setter(newSelection);
    }
  };

  const handleMainCategoryClick = (category: (typeof CLASS_CATEGORIES)[0]) => {
    if (selectedMainCategory === category.name) {
      // 이미 선택된 대분류를 다시 클릭하면 전체 초기화
      setSelectedMainCategory(null);
      setActiveMainCategoryId(null);
      setSelectedCategories([]);
    } else {
      // 새로운 대분류 선택 시, 기존 모든 카테고리(대분류, 소분류) 초기화 후 새 대분류만 선택
      setSelectedMainCategory(category.name);
      setActiveMainCategoryId(category.id);
      setSelectedCategories([category.name]);
    }
  };

  const handleSubCategoryCheckedChange = (subCategoryName: string) => {
    if (!selectedMainCategory) return; // 대분류가 선택되지 않았으면 소분류 선택 불가

    // selectedMainCategory를 제외한 현재 선택된 서브카테고리 목록
    const currentSubSelections = selectedCategories.filter(
      (cat) =>
        cat !== selectedMainCategory &&
        !CLASS_CATEGORIES.some((mainCat) => mainCat.name === cat),
    );

    let newSubSelections: string[];
    if (currentSubSelections.includes(subCategoryName)) {
      newSubSelections = currentSubSelections.filter(
        (item) => item !== subCategoryName,
      );
    } else {
      newSubSelections = [...currentSubSelections, subCategoryName];
    }

    setSelectedCategories([selectedMainCategory, ...newSubSelections]);
  };

  const getCategoryButtonText = (mainCategory: string | null) => {
    if (!mainCategory) {
      return "카테고리를 선택하세요";
    }
    const subSelectionsCount = selectedCategories.filter(
      (cat) =>
        cat !== mainCategory && !CLASS_CATEGORIES.some((mc) => mc.name === cat),
    ).length;
    if (subSelectionsCount > 0) {
      return `${mainCategory} 외 ${subSelectionsCount}개`;
    }
    return mainCategory;
  };

  const getRegionButtonText = (regions: string[]) => {
    if (!regions.length) {
      // 빈 배열일 때
      return "지역을 선택하세요";
    }
    if (regions.includes("전체")) {
      return "전체 지역";
    }
    if (regions.length > 3) {
      return `지역 (${regions.length}개 선택됨)`;
    }
    return regions.join(", ");
  };

  const currentSubCategories = activeMainCategoryId
    ? SUB_CLASS_CATEGORIES.filter(
        (subCat) => subCat.category_id === activeMainCategoryId,
      )
    : [];

  return (
    <section className="w-full py-8 px-4 md:px-8">
      {/* 상단: 필터 7개 공간 */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-4 mb-4 p-4 border rounded-md bg-gray-50">
        {/* 왼쪽 열 */}
        <div className="flex flex-col gap-2">
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
          <div className="p-2 border rounded-md bg-white flex flex-row items-center gap-6">
            <label className="block text-lg font-bold text-gray-700 min-w-[70px]">
              카테고리
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[180px] justify-start">
                  {getCategoryButtonText(selectedMainCategory)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0 flex">
                {/* 대분류 */}
                <div className="w-1/2 p-4 border-r">
                  <h4 className="font-semibold mb-2">대분류</h4>
                  {CLASS_CATEGORIES.map((category) => (
                    <div
                      key={category.id}
                      className={`flex items-center space-x-2 p-1 cursor-pointer rounded-md ${
                        activeMainCategoryId === category.id
                          ? "bg-gray-100"
                          : ""
                      }`}
                      onClick={() => handleMainCategoryClick(category)}
                    >
                      <Checkbox
                        id={`main-cat-${category.id}`}
                        checked={selectedMainCategory === category.name}
                        onCheckedChange={() =>
                          handleMainCategoryClick(category)
                        }
                      />
                      <label
                        htmlFor={`main-cat-${category.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-grow"
                      >
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
                {/* 소분류 */}
                <div className="w-1/2 p-4">
                  <h4 className="font-semibold mb-2">소분류</h4>
                  {activeMainCategoryId === null ? (
                    <p className="text-sm text-gray-500">
                      대분류를 선택해주세요.
                    </p>
                  ) : currentSubCategories.length === 0 ? (
                    <p className="text-sm text-gray-500">소분류가 없습니다.</p>
                  ) : (
                    currentSubCategories.map((subCat) => (
                      <div
                        key={subCat.id}
                        className="flex items-center space-x-2 p-1"
                      >
                        <Checkbox
                          id={`sub-cat-${subCat.id}`}
                          checked={selectedCategories.includes(subCat.name)}
                          onCheckedChange={() =>
                            handleSubCategoryCheckedChange(subCat.name)
                          }
                        />
                        <label
                          htmlFor={`sub-cat-${subCat.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {subCat.name}
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="p-2 border rounded-md bg-white flex flex-row items-center gap-6">
            <label className="block text-lg font-bold text-gray-700 min-w-[70px]">
              요일
            </label>
            <ToggleGroup
              type="multiple"
              value={selectedDays}
              onValueChange={setSelectedDays}
            >
              <ToggleGroupItem
                value="평일"
                aria-label="Toggle 평일"
                variant="outline"
              >
                평일
              </ToggleGroupItem>
              <ToggleGroupItem
                value="토요일"
                aria-label="Toggle 토요일"
                variant="outline"
              >
                토요일
              </ToggleGroupItem>
              <ToggleGroupItem
                value="일요일"
                aria-label="Toggle 일요일"
                variant="outline"
              >
                일요일
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="p-2 border rounded-md bg-white flex flex-row items-center gap-6">
            <ToggleGroup
              type="multiple"
              value={selectedDifficulty}
              onValueChange={setSelectedDifficulty}
            >
              <ToggleGroupItem
                value="입문"
                aria-label="Toggle 입문"
                variant="outline"
              >
                입문
              </ToggleGroupItem>
              <ToggleGroupItem
                value="중급"
                aria-label="Toggle 중급"
                variant="outline"
              >
                중급
              </ToggleGroupItem>
              <ToggleGroupItem
                value="고급"
                aria-label="Toggle 고급"
                variant="outline"
              >
                고급
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        {/* 오른쪽 열 */}
        <div className="flex flex-col gap-2">
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
          <div className="p-2 border rounded-md bg-white flex flex-row items-center gap-6">
            <label className="block text-lg font-bold text-gray-700 min-w-[70px] mb-2">
              시간
            </label>
            <DualRangeSlider
              min={0}
              max={24}
              step={1}
              value={timeRange}
              onValueChange={setTimeRange}
              formatLabel={(value) => `${value}:00`}
              className="pt-2 flex-grow"
            />
          </div>
          <div className="p-2 border rounded-md bg-white flex flex-row items-center gap-6">
            <label className="block text-lg font-bold text-gray-700 min-w-[70px] mb-2">
              금액
            </label>
            <DualRangeSlider
              min={0}
              max={500000}
              step={10000}
              value={priceRange}
              onValueChange={setPriceRange}
              formatLabel={(value) => value.toLocaleString()}
              className="pt-2 flex-grow"
            />
          </div>
        </div>
      </div>

      {/* 중간: 소분류 배지 표시 공간 */}
      <div className="flex flex-wrap gap-2 mb-6 p-4 border rounded-md bg-gray-50 min-h-[40px]">
        {selectedRegions.map((region) => (
          <Badge
            key={region}
            variant="default"
            className="flex items-center gap-1"
          >
            {region}
            <X
              className="ml-1 h-3 w-3 cursor-pointer"
              onClick={() => handleRemoveRegionBadge(region)}
            />
          </Badge>
        ))}
        {selectedCategories.map((category) => (
          <Badge
            key={category}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {category}
            <X
              className="ml-1 h-3 w-3 cursor-pointer"
              onClick={() => handleRemoveCategoryBadge(category)}
            />
          </Badge>
        ))}
        {selectedRegions.length === 0 && selectedCategories.length === 0 && (
          <span className="text-gray-500">선택된 필터가 없습니다.</span>
        )}
      </div>

      {/* 하단: 초기화 및 검색 버튼 */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          닫기
        </Button>
        <Button variant="outline" onClick={handleResetFilters}>
          초기화
        </Button>
        <Button>검색</Button>
      </div>
    </section>
  );
};

export default LessonFilterSection;
