import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chargePoint } from "@/api/point.api";
import { useAuthStore } from "@/store/authStore";

// 포인트 충전
export const useChargePointMutation = () => {
  const { userId } = useAuthStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (amount: number) => chargePoint(amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["points", "me", userId] });
    },
    onError: () => {},
  });
};
