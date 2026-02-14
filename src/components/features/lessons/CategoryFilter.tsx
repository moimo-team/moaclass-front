import React from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { useCategoryQuery, useSubCategoryQuery } from '@/hooks/useCategoryQuery';
import { cn } from '@/lib/utils';
import type { LessonCategory } from '@/models/lesson.model';

interface CategoryFilterProps {
	selectedCategories: string[];
	activeMainCategoryId: number | null;
	selectedMainCategory: string | null;
	handleMainCategoryClick: (category: LessonCategory) => void;
	handleSubCategoryCheckedChange: (subCategoryName: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
	selectedCategories,
	activeMainCategoryId,
	selectedMainCategory,
	handleMainCategoryClick,
	handleSubCategoryCheckedChange,
}) => {
	const { data: lessonCategories = [], isLoading: isCategoriesLoading } = useCategoryQuery();
	const { data: subCategoriesData = [], isLoading: isSubCategoriesLoading } = useSubCategoryQuery(
		activeMainCategoryId || 0,
	);

	const getCategoryButtonText = (mainCategory: string | null) => {
		if (!mainCategory) return '카테고리를 선택하세요';
		const subSelectionsCount = Math.max(0, selectedCategories.length - 1);
		if (subSelectionsCount > 0) return `${mainCategory} 외 ${subSelectionsCount}개`;
		return mainCategory;
	};

	return (
		<div className="p-2 border rounded-md bg-white flex flex-row items-center gap-6">
			<span className="block text-lg font-bold text-gray-700 min-w-[70px]">카테고리</span>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						className="w-[180px] justify-start text-left font-normal"
						title={getCategoryButtonText(selectedMainCategory)}
					>
						<span className="truncate">
							{getCategoryButtonText(selectedMainCategory)}
						</span>
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[400px] p-0 flex" align="start">
					{/* 대분류 - 스크롤 추가 */}
					<div className="w-1/2 border-r max-h-[300px] overflow-y-auto p-2">
						<h4 className="font-semibold mb-2 px-2 sticky top-0 bg-white z-10">
							대분류
						</h4>
						<div className="space-y-1">
							{isCategoriesLoading
								? Array.from({ length: 7 }).map((_, i) => (
										<Skeleton key={i} className="h-8 w-full rounded-md" />
									))
								: lessonCategories.map((category) => (
										<div
											key={category.id}
											className={cn(
												'flex items-center space-x-2 p-2 cursor-pointer rounded-md transition-colors hover:bg-gray-50',
												activeMainCategoryId === category.id &&
													'bg-gray-100 font-medium',
											)}
											onClick={() => handleMainCategoryClick(category)}
										>
											<Checkbox
												id={`main-cat-${category.id}`}
												checked={selectedMainCategory === category.name}
												onCheckedChange={() =>
													handleMainCategoryClick(category)
												}
												className="shrink-0"
											/>
											<label
												htmlFor={`main-cat-${category.id}`}
												className="text-sm leading-none cursor-pointer flex-grow truncate"
											>
												{category.name}
											</label>
										</div>
									))}
						</div>
					</div>

					{/* 소분류 - 스크롤 추가 */}
					<div className="w-1/2 max-h-[300px] overflow-y-auto p-2">
						<h4 className="font-semibold mb-2 px-2 sticky top-0 bg-white z-10">
							소분류
						</h4>
						<div className="space-y-1">
							{activeMainCategoryId === null ? (
								<p className="text-sm text-gray-500 p-2">대분류를 선택해주세요.</p>
							) : isSubCategoriesLoading ? (
								Array.from({ length: 7 }).map((_, i) => (
									<Skeleton key={i} className="h-8 w-full rounded-md" />
								))
							) : subCategoriesData.length === 0 ? (
								<p className="text-sm text-gray-500 p-2">소분류가 없습니다.</p>
							) : (
								subCategoriesData.map((subCat) => (
									<div
										key={subCat.id}
										className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md"
									>
										<Checkbox
											id={`sub-cat-${subCat.id}`}
											checked={selectedCategories.includes(subCat.name)}
											onCheckedChange={() =>
												handleSubCategoryCheckedChange(subCat.name)
											}
											className="shrink-0"
										/>
										<label
											htmlFor={`sub-cat-${subCat.id}`}
											className="text-sm leading-none cursor-pointer flex-grow truncate"
										>
											{subCat.name}
										</label>
									</div>
								))
							)}
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
};
