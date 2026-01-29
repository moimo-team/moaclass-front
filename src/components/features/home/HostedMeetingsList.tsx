import MeetingCard from "@features/meetings/MeetingCard";
import { useMeQuery } from "@/hooks/useMeQuery";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Link } from "react-router-dom";
import { useParticipationsQuery } from "@/hooks/useParticipationsQuery";
import type { Meeting } from "@/models/meeting.model";

const MeetingCardWithBadge = ({ meeting }: { meeting: Meeting }) => {
  const { data: participations, isLoading } = useParticipationsQuery(meeting.meetingId);
  const hasPendingApplicants = participations?.some(p => p.status === 'PENDING');

  if (isLoading) {
    return <div className="w-full h-80 bg-gray-100 animate-pulse rounded-lg" />;
  }

  return (
    <MeetingCard
      meeting={meeting}
      imageUrl={meeting.meetingImage}
      hasPendingApplicants={hasPendingApplicants}
    />
  );
};

function HostedMeetingsList() {
  const { meetings, isLoading, isError, error } = useMeQuery(
    "hosted",
    "all",
    1,
    4,
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <p className="text-center text-red-500">
        모임을 불러오는 중 에러가 발생했습니다: {error?.message}
      </p>
    );
  }

  if (!isLoading && (!meetings || meetings.length === 0)) {
    return null;
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-8 pt-12">
      <div className="flex justify-between w-full mb-4">
        <div className="text-xl font-bold ">내 모임 한눈에 보기</div>
        <Link to="/mypage/meetings/hosting" className="text-sm cursor-pointer">
          전체보기
        </Link>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3 justify-items-center">
        {meetings.map((meeting) => (
          <MeetingCardWithBadge key={meeting.meetingId} meeting={meeting as any} />
        ))}
      </div>
    </div>
  );
}

export default HostedMeetingsList;
