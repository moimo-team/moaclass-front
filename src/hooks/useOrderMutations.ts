import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelClass } from "@/api/order.api";
import { useAuthStore } from "@/store/authStore";
import type { CancelClassRequest, RefundResponse } from "@/models/order.model";
import type { VerifyUserResponse } from "@/api/auth.api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// 수강취소
export const useCancelClassMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { userId } = useAuthStore();
  return useMutation({
    mutationFn: ({
      enrollmentId,
      data,
    }: {
      enrollmentId: number;
      data: CancelClassRequest;
    }) => cancelClass(enrollmentId, data),
    onSuccess: (data: RefundResponse) => {
      // 주문 목록 무효화
      queryClient.invalidateQueries({
        queryKey: ["orderlist", userId],
      });

      // 포인트 내역 무효화
      queryClient.invalidateQueries({
        queryKey: ["points", "me", userId],
      });

      // authUser 캐시 수동 업데이트 (포인트 즉시 반영)
      queryClient.setQueryData<VerifyUserResponse | null>(
        ["authUser"],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            point: data.remainingPoints,
          };
        },
      );

      toast.success(
        `${data.refundAmount.toLocaleString()}원이 환불되었습니다.`,
      );
      navigate("/mypage/class/orders");
    },
    onError: () => {
      toast.error("수강취소에 실패했습니다.");
    },
  });
};
