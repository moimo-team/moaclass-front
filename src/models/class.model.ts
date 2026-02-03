// 클래스 상태 타입
export type LessonStatus = "ACTIVE" | "INACTIVE" | "DELETED" | "DRAFT" | "DUPLICATED";
export type LessonScheduleStatus = "RECRUITING" | "CLOSED" | "COMPLETED";

// 클래스 카드 데이터 (관리 페이지용)
export interface ClassCardData {
  id: number;
  title: string;
  category: string;
  thumbnailImage: string;
  status: LessonStatus;
  createdAt: string;
}
