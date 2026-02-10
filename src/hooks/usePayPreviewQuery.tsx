import { useQuery } from "@tanstack/react-query";
import { getPayPreview, type GetPayPreviewParams } from "@/api/pay.api";

export const usePayPreviewQuery = (params: GetPayPreviewParams) => {
  return useQuery({
    queryKey: ["pay-preview", params],
    queryFn: () => getPayPreview(params),
    enabled: !!params.scheduleId && !!params.quantity,
  });
};
