import { useQuery } from "@tanstack/react-query";
import { getPayPreview, type GetPayPreviewParams } from "@/api/pay.api";

export const usePayPreviewQuery = (params: GetPayPreviewParams) => {
    return useQuery({
        queryKey: ["pay-preview", params],
        queryFn: () => getPayPreview(params),
        enabled: !!params.lessonId && !!params.scheduleId && !!params.quantity,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        retry: false,
    });
}