import { cn } from "@/lib/utils";
import FilterDropdown, {
  type FilterDropdownItem,
} from "@/components/common/FilterDropdown";
import { REGIONS } from "@/constants/regions";
import { useCategoryQuery } from "@/hooks/useCategoryQuery";

interface CategorySectionProps {
  className?: string;
}

const CategorySection = ({ className }: CategorySectionProps) => {
  const regionItems: FilterDropdownItem[] = REGIONS.map((region) => ({
    key: region.id,
    label: region.name,
    // TODO: 주소 확정되면 수정
    //href: `/meetings?region=${region}`,
  }));

  const { data: categories, isLoading: isCategoriesLoading } =
    useCategoryQuery();

  const categoryItems: FilterDropdownItem[] = isCategoriesLoading
    ? []
    : (categories || []).map((category) => ({
        key: category.id,
        label: category.name,
        //href: `/meetings?category=${category.name}`,
      }));

  return (
    <section className={cn("w-full py-12", className)}>
      <h2 className="text-2xl font-bold mb-4 text-left">클래스 찾기</h2>
      <div className="flex justify-start gap-4">
        <FilterDropdown title="지역별 클래스 둘러보기" items={regionItems} />
        <FilterDropdown
          title="카테고리별 클래스 둘러보기"
          items={categoryItems}
        />
      </div>
    </section>
  );
};

export default CategorySection;
