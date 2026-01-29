import { getParticipations } from "@/api/participation.api";
import { useQuery } from "@tanstack/react-query";

// 모임 신청자 목록 조회 (모임장용 - status 포함)
export const useParticipationsQuery = (meetingId: number) => {
    return useQuery({
        queryKey: ["participations", meetingId],
        queryFn: () => getParticipations(meetingId),
        staleTime: 1000 * 60 * 30, // 30분
        retry: false,
    });
}
