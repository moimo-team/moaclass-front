import MeetingCard from "@features/meetings/MeetingCard";
import type { Meeting } from "@/models/meeting.model";
import { isMeetingClosed } from "@/utils/meetingUtils";
import { useSearchParams } from "react-router-dom";

interface MeetingListProps {
  meetings: Meeting[];
}

const MeetingList = ({ meetings }: MeetingListProps) => {
  const [searchParams] = useSearchParams();
  const finishedFilter = searchParams.get("finishedFilter") === "true";

  // finishedFilter가 false(모집 중)일 때만 클라이언트 사이드 필터링 적용
  const filteredMeetings = finishedFilter
    ? meetings
    : meetings.filter(m => !isMeetingClosed(m.currentParticipants, m.maxParticipants, m.meetingDate));

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3 justify-items-center">
      {filteredMeetings.filter(Boolean).map((meeting) => (
        <MeetingCard key={meeting.meetingId} meeting={meeting} imageUrl={meeting.meetingImage} />
      ))}
    </div>
  );
};

export default MeetingList;
