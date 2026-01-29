import { useMemo } from "react";

interface UsePaginationOptions {
  page: number;
  limit: number;
  totalCount: number;
  apiTotalPages: number;
}

export const usePagination = (options: UsePaginationOptions) => {
  const { page, limit, totalCount, apiTotalPages = 0 } = options;

  const totalPages = useMemo(() => {
    if (apiTotalPages > 0) {
      return apiTotalPages;
    }
    if (totalCount === 0 || limit === 0) return 1;
    return Math.ceil(totalCount / limit);
  }, [totalCount, limit, apiTotalPages]);

  const isFirstPage = page === 1;
  const isLastPage = page === totalPages;

  return {
    totalPages,
    isFirstPage,
    isLastPage,
  };
};
