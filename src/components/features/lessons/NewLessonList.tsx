import LessonListSection from "@/components/features/lessons/LessonListSection";
import { useLatestLessonsQuery } from "@/hooks/useLessonsQuery";

function NewLessonList() {
  const { data, isLoading, isError } = useLatestLessonsQuery();
  const safeLessons = data || [];

  return (
    <LessonListSection
      title="새로 추천하는 원데이 클래스"
      seeMoreHref="/lessons" // TODO: URL 확정되면 수정
      hideIfEmpty={true}
      lessons={safeLessons}
      isLoading={isLoading}
      isError={isError}
      queryKeyToInvalidate={["latestLessons"]}
    />
  );
}

export default NewLessonList;
