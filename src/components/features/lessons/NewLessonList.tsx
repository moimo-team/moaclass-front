import LessonListSection from "@/components/features/lessons/LessonListSection";

function NewLessonList() {
  return (
    <LessonListSection
      title="새로 추천하는 원데이 클래스"
      seeMoreHref="/lessons" // TODO: URL 확정되면 수정
      hideIfEmpty={true}
    />
  );
}

export default NewLessonList;
