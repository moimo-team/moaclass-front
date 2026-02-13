import { getCancelClass, getOrderDetail, getOrderList } from "@/api/order.api";
import { useAuthStore } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";
import { usePagination } from "./usePagination";

// 내 클래스 결제내역 조회
export const useOrderlistQuery = (
  filter: string,
  page: number = 1,
  limit: number = 6,
) => {
  const { userId } = useAuthStore();

  const queryResult = useQuery({
    queryKey: ["orderlist", userId, filter, page, limit],
    queryFn: () => getOrderList(filter, page, limit),
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
    enabled: !!id,
  });
};

// 결제상세 조회
export const useOrderDetailQuery = (pointTransactionId: number) => {
  return useQuery({
    queryKey: ["orderDetail", pointTransactionId],
    queryFn: () => getOrderDetail(pointTransactionId),
    enabled: !!pointTransactionId,
  });
};
