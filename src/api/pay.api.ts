import { apiClient } from "@/api/client";
import type { PayPreviewResponse } from "@/models/pay.model";

export interface GetPayPreviewParams {
    lessonId?: number;
    scheduleId?: number;
    quantity?: number;
}

export const getPayPreview = async (params: GetPayPreviewParams): Promise<PayPreviewResponse> => {
    try {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value === undefined || value === null) return;
            queryParams.append(key, String(value));
        });
        const queryString = queryParams.toString();
        const url = queryString ? `/payments/preview?${queryString}` : "/payments/preview";
        const response = await apiClient.get(url);
        return response.data;
    } catch (error) {
        console.error("getPayPreview error:", error);
        throw error;
    }
}