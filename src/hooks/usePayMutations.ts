import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPayment } from "@/api/pay.api";
import { type PayInfoValues } from "@/api/pay.api";
import { AxiosError } from "axios";

// 결제하기 훅
export const usePayMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PayInfoValues) => {
      return await createPayment(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error(error);
    },
  });
};
