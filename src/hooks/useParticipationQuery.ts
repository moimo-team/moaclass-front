import { getParticipants } from "@/api/participation.api";
import { useQuery } from "@tanstack/react-query";

export const useParticipationQuery = (meetingId: number) => {
    return useQuery({
        queryKey: ["participants", meetingId],
        queryFn: () => getParticipants(meetingId),
        staleTime: 1000 * 60 * 30, // 30분
        retry: false,
    });
}