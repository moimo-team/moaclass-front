import type { LessonStatus } from "@/models/lesson.model";

export const STATUS_MAP: Record<string, LessonStatus> = {
  운영중: "ACTIVE",
  "휴면 상태": "INACTIVE",
};

export const REVERSE_STATUS_MAP: Record<LessonStatus, string> = {
  ACTIVE: "운영중",
  INACTIVE: "휴면 상태",
  // 내부용
  DELETED: "삭제됨",
  DRAFT: "임시저장",
  DUPLICATED: "복제됨",
};

export const getStatusDisplayName = (status: LessonStatus): string => {
  return REVERSE_STATUS_MAP[status] || status;
};

export const getStatusEnumValue = (
  displayName: string,
): LessonStatus | undefined => {
  return STATUS_MAP[displayName as keyof typeof STATUS_MAP];
};
