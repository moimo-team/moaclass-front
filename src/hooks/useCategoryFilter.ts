import { useState, useMemo } from "react";
import { LESSON_SUB_CATEGORIES } from "@/mock/mockData/categoryMock";
import type { LessonCategory, LessonSubCategory } from "@/models/lesson.model";

export const useCategoryFilter = () => {
  const initialSelectedCategories: string[] = [];
  const initialActiveMainCategoryId: number | null = null;
  const initialSelectedMainCategory: string | null = null;

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialSelectedCategories,
  );
  const [activeMainCategoryId, setActiveMainCategoryId] = useState<
    number | null
  >(initialActiveMainCategoryId);
  const [selectedMainCategory, setSelectedMainCategory] = useState<
    string | null
  >(initialSelectedMainCategory);

  const handleMainCategoryClick = (category: LessonCategory) => {
    if (selectedMainCategory === category.name) {
      resetCategories();
    } else {
      setSelectedMainCategory(category.name);
      setActiveMainCategoryId(category.id);
      setSelectedCategories([category.name]);
    }
  };

  const handleSubCategoryCheckedChange = (subCategoryName: string) => {
    if (!selectedMainCategory) return;

    const currentSubSelections = selectedCategories.filter(
      (cat) => cat !== selectedMainCategory,
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

  const handleRemoveCategoryBadge = (categoryName: string) => {
    if (categoryName === selectedMainCategory) {
      resetCategories();
    } else {
      setSelectedCategories((prev) =>
        prev.filter((item) => item !== categoryName),
      );
    }
  };

  const getCategoryButtonText = (mainCategory: string | null) => {
    if (!mainCategory) return "카테고리를 선택하세요";
    const subSelectionsCount = Math.max(0, selectedCategories.length - 1);
    if (subSelectionsCount > 0)
      return `${mainCategory} 외 ${subSelectionsCount}개`;
    return mainCategory;
  };

  const resetCategories = () => {
    setSelectedCategories(initialSelectedCategories);
    setActiveMainCategoryId(initialActiveMainCategoryId);
    setSelectedMainCategory(initialSelectedMainCategory);
  };

  const currentSubCategories = useMemo<LessonSubCategory[]>(() => {
    return activeMainCategoryId
      ? LESSON_SUB_CATEGORIES.filter(
          (subCat) => subCat.category_id === activeMainCategoryId,
        ).map((subCat) => ({
          id: subCat.id,
          name: subCat.name,
          categoryId: subCat.category_id,
        }))
      : [];
  }, [activeMainCategoryId]);

  return {
    selectedCategories,
    setSelectedCategories,
    activeMainCategoryId,
    setActiveMainCategoryId,
    selectedMainCategory,
    setSelectedMainCategory,
    handleMainCategoryClick,
    handleSubCategoryCheckedChange,
    handleRemoveCategoryBadge,
    getCategoryButtonText,
    currentSubCategories,
    resetCategories,
  };
};
