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

const CategorySection = () => {
  // 지역 드롭다운 아이템 준비
  const regionItems: FilterDropdownItem[] = REGIONS.map((region) => ({
    key: region.id,
    label: region.name,
    // TODO: 주소 확정되면 수정
    //href: `/meetings?region=${region}`,
  }));

  // 카테고리 드롭다운 아이템 준비
  const categoryItems: FilterDropdownItem[] = interestCategories.map(
    (category) => ({
      key: category.id,
      label: category.name,
      //href: `/meetings?category=${category.name}`,
    }),
  );

  return (
    <section className="w-full max-w-4xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4 text-left px-4 md:px-0">
        클래스 찾기
      </h2>
      <div className="flex justify-start gap-4 px-4 md:px-0">
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
