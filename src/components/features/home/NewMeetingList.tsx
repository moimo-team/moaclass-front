import MeetingListSection from "@/components/features/home/MeetingListSection";
import { useIsMobile } from "@/hooks/use-mobile";

function NewMeetingList() {
  const isMobile = useIsMobile();
  const limit = isMobile ? 9 : 8;

  return (
    <MeetingListSection
      title="새로 개설된 모임 한눈에 보기"
      queryOptions={{ sort: "NEW", limit }}
      seeMoreHref="/meetings?sort=NEW"
      hideIfEmpty={true}
    />
  );
}

export default NewMeetingList;
