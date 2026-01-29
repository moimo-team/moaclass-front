import { useQuery } from "@tanstack/react-query";
import type { GetMeetingsParams, SearchMeetingsParams } from "@/api/meeting.api";
import { getMeetings, searchMeetings } from "@/api/meeting.api";

export const useMeetingsQuery = (params: GetMeetingsParams) => {
  const meetingsResponse = useQuery({
    queryKey: ["meetings", params],
    queryFn: () => getMeetings(params),
    retry: 1,
  });

  return meetingsResponse;
};

export const useSearchMeetingsQuery = (params: SearchMeetingsParams) => {
  const { keyword, page, limit } = params;

  return useQuery({
    queryKey: ["meetings", "search", { keyword, page, limit }],
    queryFn: () => searchMeetings({ keyword, page, limit }),
    enabled: !!keyword, // keyword가 있을 때만 쿼리 실행
    retry: 1,
  });
};
