import { cn } from "@/lib/utils";
import FilterDropdown, {
  type FilterDropdownItem,
} from "@/components/common/FilterDropdown";
import { interestCategories } from "@/mock/mockData";

// TODO: 하드코딩 데이터 삭제
const REGIONS = [
  {
    id: 1,
    name: "서울",
  },
  {
    id: 2,
    name: "경기도",
  },
  {
    id: 3,
    name: "부산",
  },
  {
    id: 4,
    name: "인천",
  },
  {
    id: 5,
    name: "대구",
  },
  {
    id: 6,
    name: "울산",
  },
  {
    id: 7,
    name: "광주",
  },
  {
    id: 8,
    name: "대전",
  },
  {
    id: 9,
    name: "경상남도",
  },
  {
    id: 10,
    name: "경상북도",
  },
  {
    id: 11,
    name: "전라남도",
  },
  {
    id: 12,
    name: "전라북도",
  },
  {
    id: 13,
    name: "충청남도",
  },
  {
    id: 14,
    name: "충청북도",
  },
  {
    id: 15,
    name: "강원도",
  },
  {
    id: 16,
    name: "제주도",
  },
  {
    id: 17,
    name: "세종",
  },
];

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

  const categoryItems: FilterDropdownItem[] = interestCategories.map(
    (category) => ({
      key: category.id,
      label: category.name,
      //href: `/meetings?category=${category.name}`,
    }),
  );

  return (
    <section className={cn("w-full py-12", className)}>
      <h2 className="text-2xl font-bold mb-4 text-left">클래스 찾기</h2>
      <div className="flex justify-start gap-4">
        <FilterDropdown
          title="지역별 클래스 둘러보기"
          items={regionItems}
          allOptionHref="/meetings"
        />
        <FilterDropdown
          title="카테고리별 클래스 둘러보기"
          items={categoryItems}
          allOptionHref="/meetings"
        />
      </div>
    </section>
  );
};

export default CategorySection;
