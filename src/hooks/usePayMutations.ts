import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEnrollment } from "@/api/pay.api";
import { type PayInfoValues } from "@/api/pay.api";
import { AxiosError } from "axios";
import { type PayErrorResponse } from "@/models/pay.model";

// 결제하기 훅
export const usePayMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PayInfoValues) => {
      return await createEnrollment(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
    onError: (error: AxiosError<PayErrorResponse>) => {
      console.error(error);
    },
  });
};
