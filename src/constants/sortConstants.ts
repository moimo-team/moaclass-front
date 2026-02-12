export type SortEnum =
  | "PRICE_ASC"
  | "PRICE_DESC"
  | "DEADLINE"
  | "UPDATE"
  | "RATE"
  | "LIKES"
  | "LATEST"; // '기본값

export const SORT_MAP: Record<string, SortEnum> = {
  "가격 오름차순": "PRICE_ASC",
  "가격 내림차순": "PRICE_DESC",
  "마감일 빠른 순": "DEADLINE",
  "최근 업데이트 순": "UPDATE",
  "평점 높은 순": "RATE",
  "좋아요 많은 순": "LIKES",
  "생성일 최신순": "LATEST",
};

export const REVERSE_SORT_MAP: Record<SortEnum, string> = {
  PRICE_ASC: "가격 오름차순",
  PRICE_DESC: "가격 내림차순",
  DEADLINE: "마감일 빠른 순",
  UPDATE: "최근 업데이트 순",
  RATE: "평점 높은 순",
  LIKES: "좋아요 많은 순",
  LATEST: "생성일 최신순",
};

export const getSortDisplayName = (sortEnum: SortEnum): string => {
  return REVERSE_SORT_MAP[sortEnum] || sortEnum;
};

export const getSortEnumValue = (displayName: string): SortEnum | undefined => {
  return SORT_MAP[displayName as keyof typeof SORT_MAP];
};
