import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
// TODO: lesson 데이터 타입 수정되면 고치기, hook에서 가져오는 게 이상
import type {
  ClassCategory,
  SubClassCategory,
} from "@/hooks/useCategoryFilter";
interface CategoryFilterProps {
  selectedCategories: string[];
  activeMainCategoryId: number | null;
  selectedMainCategory: string | null;
  handleMainCategoryClick: (category: ClassCategory) => void;
  handleSubCategoryCheckedChange: (subCategoryName: string) => void;
  getCategoryButtonText: (mainCategory: string | null) => string;
  currentSubCategories: SubClassCategory[];
  CLASS_CATEGORIES: ClassCategory[];
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategories,
  activeMainCategoryId,
  selectedMainCategory,
  handleMainCategoryClick,
  handleSubCategoryCheckedChange,
  getCategoryButtonText,
  currentSubCategories,
  CLASS_CATEGORIES,
}) => {
  return (
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
                  activeMainCategoryId === category.id ? "bg-gray-100" : ""
                }`}
                onClick={() => handleMainCategoryClick(category)}
              >
                <Checkbox
                  id={`main-cat-${category.id}`}
                  checked={selectedMainCategory === category.name}
                  onCheckedChange={() => handleMainCategoryClick(category)}
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
              <p className="text-sm text-gray-500">대분류를 선택해주세요.</p>
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
  );
};
