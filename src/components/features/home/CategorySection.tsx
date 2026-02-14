import FilterDropdown, { type FilterDropdownItem } from '@/components/common/FilterDropdown';
import { REGIONS } from '@/constants/regions';
import { useCategoryQuery } from '@/hooks/useCategoryQuery';
import { cn } from '@/lib/utils';

interface CategorySectionProps {
	className?: string;
}

const CategorySection = ({ className }: CategorySectionProps) => {
	const regionItems: FilterDropdownItem[] = REGIONS.map((region) => ({
		key: region.id,
		label: region.name,
		href: `/lessons?regionId=${region.id}`,
	}));

	const { data: categories, isLoading: isCategoriesLoading } = useCategoryQuery();

	const categoryItems: FilterDropdownItem[] = isCategoriesLoading
		? []
		: (categories || []).map((category) => ({
				key: category.id,
				label: category.name,
				// TODO: 소분류 카테고리 추가되면 주소 수정
				href: `/lessons?categoryId=${category.id}`,
			}));

	return (
		<section className={cn('w-full py-12', className)}>
			<h2 className="text-2xl font-bold mb-4 text-left">클래스 찾기</h2>
			<div className="flex justify-start gap-4">
				<FilterDropdown title="지역별 클래스 둘러보기" items={regionItems} />
				<FilterDropdown title="카테고리별 클래스 둘러보기" items={categoryItems} />
			</div>
		</section>
	);
};

export default CategorySection;
