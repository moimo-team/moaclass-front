import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { LessonFilterSection } from "@/components/features/lessons/LessonFilterSection";
import { LessonCard } from "@/components/features/lessons/LessonCard";
import PaginationComponent from "@/components/common/PaginationComponent";
import { useLessonsQuery } from "@/hooks/useLessonsQuery";
import { useFilterStore } from "@/store/filterStore";
import type { Lesson } from "@/models/lesson.model";

const LessonListDisplay: React.FC<{
  lessons: Lesson[];
  isLoading: boolean;
  isError: boolean;
  emptyMessage: string;
}> = ({ lessons, isLoading, isError, emptyMessage }) => {
  if (isLoading) return <div className="text-center p-8">로딩 중...</div>;
  if (isError)
    return (
      <div className="text-center p-8 text-red-500">
        데이터를 불러오는데 실패했습니다.
      </div>
    );
  if (lessons.length === 0)
    return <div className="text-center p-8 text-gray-500">{emptyMessage}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {lessons.map((lesson) => (
        <LessonCard key={lesson.id} lesson={lesson} />
      ))}
    </div>
  );
};

const LessonListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { setAllFilters, resetFilters } = useFilterStore();

  const parsedParams = React.useMemo(() => {
    return {
      selectedCategories: searchParams.get("categories")?.split(",") || [],
      selectedRegions: searchParams.get("regions")?.split(",") || [],
      selectedDays: searchParams.get("days")?.split(",") || [],
      selectedDifficulty: searchParams.get("difficulty")?.split(",") || [],
      selectedPersonnel: searchParams.get("personnel") || "",
      timeRange: [
        Number(searchParams.get("minTime")) || 0,
        Number(searchParams.get("maxTime")) || 24,
      ] as [number, number],
      priceRange: [
        Number(searchParams.get("minPrice")) || 0,
        Number(searchParams.get("maxPrice")) || 500000,
      ] as [number, number],
      // TODO: keyword도 필요하다면 여기서 파싱
    };
  }, [searchParams]);

  useEffect(() => {
    setAllFilters(parsedParams);
  }, [parsedParams, setAllFilters]);

  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = 12;

  const queryParams = {
    page: currentPage,
    limit: itemsPerPage,
    categories:
      parsedParams.selectedCategories.length > 0
        ? parsedParams.selectedCategories
        : undefined,
    regions:
      parsedParams.selectedRegions.length > 0
        ? parsedParams.selectedRegions
        : undefined,
    days:
      parsedParams.selectedDays.length > 0
        ? parsedParams.selectedDays
        : undefined,
    difficulty:
      parsedParams.selectedDifficulty.length > 0
        ? parsedParams.selectedDifficulty
        : undefined,
    personnel: parsedParams.selectedPersonnel
      ? Number(parsedParams.selectedPersonnel.replace(/\D/g, ""))
      : undefined,
    minTime:
      parsedParams.timeRange[0] > 0 ? parsedParams.timeRange[0] : undefined,
    maxTime:
      parsedParams.timeRange[1] < 24 ? parsedParams.timeRange[1] : undefined,
    minPrice:
      parsedParams.priceRange[0] > 0 ? parsedParams.priceRange[0] : undefined,
    maxPrice:
      parsedParams.priceRange[1] < 500000
        ? parsedParams.priceRange[1]
        : undefined,
    keyword: searchParams.get("keyword") || undefined,
  };

  const { data, isLoading, isError } = useLessonsQuery(queryParams, 0);
  const { totalPages } = { totalPages: data?.totalPages || 0 };

  const handlePageChange = (page: number) => {
    searchParams.set("page", String(page));
    setSearchParams(searchParams);
    window.scrollTo(0, 0);
  };

  const filterStore = useFilterStore();

  const handleSearchClick = () => {
    const params = new URLSearchParams();

    if (
      filterStore.selectedRegions.length > 0 &&
      !filterStore.selectedRegions.includes("전체")
    ) {
      params.append("regions", filterStore.selectedRegions.join(","));
    }
    if (filterStore.selectedCategories.length > 0) {
      params.append("categories", filterStore.selectedCategories.join(","));
    }
    if (filterStore.selectedDays.length > 0) {
      params.append("days", filterStore.selectedDays.join(","));
    }
    if (filterStore.selectedDifficulty.length > 0) {
      params.append("difficulty", filterStore.selectedDifficulty.join(","));
    }
    if (filterStore.selectedPersonnel) {
      params.append("personnel", filterStore.selectedPersonnel);
    }
    if (filterStore.timeRange[0] > 0 || filterStore.timeRange[1] < 24) {
      params.append("minTime", String(filterStore.timeRange[0]));
      params.append("maxTime", String(filterStore.timeRange[1]));
    }
    if (filterStore.priceRange[0] > 0 || filterStore.priceRange[1] < 500000) {
      params.append("minPrice", String(filterStore.priceRange[0]));
      params.append("maxPrice", String(filterStore.priceRange[1]));
    }

    params.set("page", "1");
    setSearchParams(params);
  };

  const handleResetAllFilters = () => {
    resetFilters();
    setSearchParams({});
    window.scrollTo(0, 0);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">클래스 목록</h1>

      <LessonFilterSection
        showCloseButton={false}
        onSearch={handleSearchClick}
        onReset={handleResetAllFilters}
      />

      <div className="my-8">
        <LessonListDisplay
          lessons={data?.lessons || []}
          isLoading={isLoading}
          isError={isError}
          emptyMessage="조건에 맞는 클래스가 없습니다."
        />
      </div>

      <div className="flex justify-center mt-8">
        <PaginationComponent
          page={currentPage}
          totalPages={totalPages}
          setPage={handlePageChange}
        />
      </div>
    </div>
  );
};

export default LessonListPage;
