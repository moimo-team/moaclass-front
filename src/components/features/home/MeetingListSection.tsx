import { useMeetingsQuery } from "@/hooks/useMeetingsQuery";
import type { GetMeetingsParams } from "@/api/meeting.api";
import { useAuthStore } from "@/store/authStore";
import { Link } from "react-router-dom";
import MeetingList from "@/components/features/home/MeetingList";
import { Skeleton } from "../../ui/skeleton";

interface MeetingListSectionProps {
  title: string;
  queryOptions: GetMeetingsParams;
  seeMoreHref?: string;
  hideIfEmpty?: boolean;
}

function MeetingListSection({
  title,
  queryOptions,
  seeMoreHref,
  hideIfEmpty = false,
}: MeetingListSectionProps) {
  const { nickname } = useAuthStore();
  const {
    data: meetingsResponse,
    isLoading,
    isError,
  } = useMeetingsQuery(queryOptions);

  const meetings = meetingsResponse?.data || [];
  const safeNickname = nickname || "예비 모이머";
  const finalTitle = title.replace("{nickname}", safeNickname);

  if (hideIfEmpty && !isLoading && meetings.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-8 pt-12">
      <div className="flex justify-between w-full mb-4">
        <div className="text-xl font-bold ">{finalTitle}</div>
        {seeMoreHref && (
          <Link to={seeMoreHref} className="text-sm cursor-pointer">
            전체보기
          </Link>
        )}
      </div>
      {isLoading && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3 justify-items-center">
          {[...Array(8)].map((_, index) => (
            <Skeleton key={index} className="w-full h-80 rounded-lg" />
          ))}
        </div>
      )}
      {isError && (
        <p className="text-center text-red-500">
          모임을 불러오는 중 에러가 발생했습니다.
        </p>
      )}
      {!isLoading && !isError && meetings.length > 0 && (
        <MeetingList meetings={meetings} />
      )}
      {!isLoading && !isError && meetings.length === 0 && (
        <p className="text-center py-16">모임이 없습니다.</p>
      )}
    </div>
  );
}

export default MeetingListSection;
