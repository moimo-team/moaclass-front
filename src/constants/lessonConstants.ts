import type { Level } from "@/models/lesson.model";

export const LEVEL_MAP: Record<Level, string> = {
  BEGINNER: "입문",
  INTERMEDIATE: "중급",
  ADVANCED: "고급",
};

export const REVERSE_LEVEL_MAP: Record<string, Level> = {
  입문: "BEGINNER",
  중급: "INTERMEDIATE",
  고급: "ADVANCED",
};

/**
 * Level enum 값을 받아 한글 표시 이름을 반환하는 유틸리티 함수
 * @param level - Level enum 값 ("BEGINNER" | "INTERMEDIATE" | "ADVANCED")
 * @returns 한글 표시 이름 ("입문" | "중급" | "고급") 또는 매핑되지 않을 경우 원래 값
 */
export const getLevelDisplayName = (level: Level): string => {
  return LEVEL_MAP[level] || level;
};

/**
 * 한글 표시 이름을 받아 Level enum 값을 반환하는 유틸리티 함수 (필터링 시 활용)
 * @param displayName - 한글 표시 이름 ("입문" | "중급" | "고급")
 * @returns Level enum 값 또는 매핑되지 않을 경우 undefined
 */
export const getLevelEnumValue = (displayName: string): Level | undefined => {
  return REVERSE_LEVEL_MAP[displayName];
};
