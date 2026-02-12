import { getCancelClass, getOrderList } from "@/api/order.api";
import { useAuthStore } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";
import { usePagination } from "./usePagination";

// 내 클래스 결제내역 조회
export const useOrderlistQuery = (
  status: string = "all",
  page: number = 1,
  limit: number = 6,
) => {
  const { userId } = useAuthStore();

  const queryResult = useQuery({
    queryKey: ["orderlist", userId, status, page, limit],
    queryFn: () => getOrderList(status, page, limit),
    enabled: !!userId,
  });

  const { totalPages, isFirstPage, isLastPage } = usePagination({
    page,
    limit,
    totalCount: queryResult.data?.meta?.totalCount ?? 0,
    apiTotalPages: queryResult.data?.meta?.totalPages ?? 1,
  });

  return {
    ...queryResult,
    orderlist: queryResult.data?.data ?? [],
    meta: queryResult.data?.meta,
    totalPages,
    isFirstPage,
    isLastPage,
  };
};

// 수강취소 내역 조회
export const useCancelClassQuery = (id: number) => {
  return useQuery({
    queryKey: ["cancelClass", id],
    queryFn: () => getCancelClass(id),
  });
};
