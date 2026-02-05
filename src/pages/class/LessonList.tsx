import React, { useState } from "react";
import { useLessonFilters } from "@/hooks/useLessonFilters";
import { LessonFilterSection } from "@/components/features/lessons/LessonFilterSection";
import { useLessonsQuery } from "@/hooks/useLessonsQuery";
import { usePagination } from "@/hooks/usePagination";
import PaginationComponent from "@/components/common/PaginationComponent";
import type { Lesson } from "@/models/lesson.model";
import { LessonCard } from "@/components/features/lessons/LessonCard";

// 리스트 표시용 서브 컴포넌트 (그대로 유지)
const LessonListDisplay: React.FC<{
  lessons: Lesson[];
  isLoading: boolean;
  isError: boolean;
  emptyMessage: string;
}> = ({ lessons, isLoading, isError, emptyMessage }) => {
  if (isLoading) return <div className="text-center p-8">로딩 중...</div>;
  if (isError) return <div className="text-center p-8 text-red-500">실패</div>;
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
  // 훅 호출 (로그 제거됨)
  const lessonFilters = useLessonFilters();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTrigger, setSearchTrigger] = useState(0);
  const itemsPerPage = 12;

  // API 요청용 파라미터 변환
  const personnelCount = lessonFilters.selectedPersonnel
    ? parseInt(lessonFilters.selectedPersonnel.replace(/\D/g, ""), 10)
    : undefined;

  const queryParams = {
    page: currentPage,
    limit: itemsPerPage,
    categories:
      lessonFilters.selectedCategories.length > 0
        ? lessonFilters.selectedCategories
        : undefined,
    regions: lessonFilters.selectedRegions.includes("전체")
      ? undefined
      : lessonFilters.selectedRegions,
    days:
      lessonFilters.selectedDays.length > 0
        ? lessonFilters.selectedDays
        : undefined,
    difficulty:
      lessonFilters.selectedDifficulty.length > 0
        ? lessonFilters.selectedDifficulty
        : undefined,
    personnel: personnelCount,
    minTime: lessonFilters.timeRange[0],
    maxTime: lessonFilters.timeRange[1],
    minPrice: lessonFilters.priceRange[0],
    maxPrice: lessonFilters.priceRange[1],
  };

  const { data, isLoading, isError } = useLessonsQuery(
    queryParams,
    searchTrigger,
  );

  const { totalPages } = usePagination({
    page: currentPage,
    limit: itemsPerPage,
    totalCount: data?.totalCount || 0,
    apiTotalPages: data?.totalPages || 0,
  });

  const handleSearchClick = () => {
    setSearchTrigger((prev) => prev + 1);
    setCurrentPage(1);
  };

  const handleResetAllFilters = () => {
    lessonFilters.handleResetFilters();
    setSearchTrigger(0);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">클래스 목록</h1>

      {/* Spread Syntax로 깔끔하게 전달 */}
      <LessonFilterSection
        {...lessonFilters}
        showCloseButton={false}
        onSearch={handleSearchClick}
        handleResetFilters={handleResetAllFilters} // 오버라이딩 (리스트 페이지 전용 초기화)
      />

      <div className="my-8">
        <LessonListDisplay
          lessons={data?.lessons || []}
          isLoading={isLoading}
          isError={isError}
          emptyMessage="필터링 조건에 맞는 클래스가 없습니다."
        />
      </div>

      <div className="flex justify-center mt-8">
        <PaginationComponent
          page={currentPage}
          totalPages={totalPages}
          setPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default LessonListPage;
