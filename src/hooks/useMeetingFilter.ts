import type { SortType } from "@/api/meeting.api";

export const useMeetingFilter = (searchParams: URLSearchParams) => {
  const sort = (searchParams.get("sort") as SortType) || "NEW";
  const interestFilter = searchParams.get("interestFilter") || "ALL";
  const finishedFilter = searchParams.get("finishedFilter") === "true";

  return {
    filters: { sort, interestFilter, finishedFilter },
  };
};
