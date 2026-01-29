export type SortType = "NEW" | "UPDATE" | "DEADLINE";

export const sortOptions: { value: SortType; label: string }[] = [
  { value: "NEW", label: "최신순" },
  { value: "UPDATE", label: "업데이트순" },
  { value: "DEADLINE", label: "마감임박순" },
];
