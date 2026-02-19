import FormField from '@components/common/FormField';
import { useFormContext } from 'react-hook-form';

import { SelectableBadge } from '@/components/common/SelectableBadge';
import { useCategoryQuery, useSubCategoryQuery } from '@/hooks/useCategoryQuery';

import type { ClassFormValues } from '../classSchema';

export function CategorySection() {
	const {
		watch,
		setValue,
		formState: { errors },
	} = useFormContext<ClassFormValues>();

	const selectedCategoryId = watch('classCategoryId');
	const selectedSubCategoryIds = watch('subCategoryIds');

	const { data: categories } = useCategoryQuery();
	const { data: subCategories } = useSubCategoryQuery(selectedCategoryId);

	const toggleCategory = (categoryId: number) => {
		setValue('classCategoryId', categoryId, { shouldValidate: true });
	};

	const toggleSubCategory = (subCategoryId: number) => {
		const currentIds = [...selectedSubCategoryIds];
		const index = currentIds.indexOf(subCategoryId);
		if (index > -1) {
			currentIds.splice(index, 1);
		} else {
			currentIds.push(subCategoryId);
		}
		setValue('subCategoryIds', currentIds, { shouldValidate: true });
	};

	return (
		<>
			{/* 대분류 카테고리 */}
			<FormField
				label="대분류 카테고리"
				description="클래스의 카테고리를 선택해주세요"
				required
			>
				<div className="flex flex-wrap gap-2">
					{categories?.map((category) => (
						<SelectableBadge
							key={category.id}
							label={category.name}
							isSelected={selectedCategoryId === category.id}
							onClick={() => toggleCategory(category.id)}
							size="md"
						/>
					))}
				</div>
				{errors.classCategoryId && (
					<p className="text-xs text-red-500 mt-1">{errors.classCategoryId.message}</p>
				)}
			</FormField>

			{/* 소분류 카테고리 - 대분류 선택 후 표시 */}
			{selectedCategoryId > 0 && subCategories && subCategories.length > 0 && (
				<FormField
					label="소분류 카테고리"
					description="클래스의 소분류 카테고리를 선택해주세요 (복수 선택 가능)"
					required
				>
					<div className="flex flex-wrap gap-2">
						{subCategories.map((subCategory) => (
							<SelectableBadge
								key={subCategory.id}
								label={subCategory.name}
								isSelected={selectedSubCategoryIds.includes(subCategory.id)}
								onClick={() => toggleSubCategory(subCategory.id)}
								size="md"
							/>
						))}
					</div>
					{errors.subCategoryIds && (
						<p className="text-xs text-red-500 mt-1">{errors.subCategoryIds.message}</p>
					)}
				</FormField>
			)}
		</>
	);
}
