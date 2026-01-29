import { useQuery } from "@tanstack/react-query";
import { getMeetingById } from "@/api/meeting.api";

export const useMeetingQuery = (meetingId?: number) => {
    return useQuery({
        queryKey: ["meeting", meetingId],
        queryFn: () => getMeetingById(meetingId!),
        enabled: !!meetingId, // meetingId가 있을 때만 실행
        retry: 1,
    });
};
