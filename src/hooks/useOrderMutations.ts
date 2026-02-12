import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelClass } from "@/api/order.api";
import { useAuthStore } from "@/store/authStore";
import type { CancelClassRequest } from "@/models/order.model";

// 수강취소
export const useCancelClassMutation = () => {
  const queryClient = useQueryClient();
  const { userId } = useAuthStore();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CancelClassRequest }) =>
      cancelClass(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orderlist", userId],
      });
    },
    onError: (error) => {
      console.error("cancelClass error:", error);
    },
  });
};
