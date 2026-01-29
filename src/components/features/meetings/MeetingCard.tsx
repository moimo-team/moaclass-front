import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { IoLocationOutline } from "react-icons/io5";
import { AiOutlineTeam } from "react-icons/ai";
import { Link } from "react-router-dom";
import type { Meeting } from "@/models/meeting.model";
import { getDistrictFromAddress } from "@/utils/formatAddress";
import { isMeetingClosed } from "@/utils/meetingUtils";
import defaultMeetingImage from "@/assets/images/moimo-meetings.png";

interface MeetingCardProps {
  meeting: Meeting;
  imageUrl?: string;
  className?: string;
  hasPendingApplicants?: boolean;
}
function MeetingCard({ meeting, imageUrl, className, hasPendingApplicants }: MeetingCardProps) {
  const { meetingId, title, address, currentParticipants } = meeting;
  const href = `/meetings/${meetingId}`;
  return (
    <Link
      to={href}
      className="relative block w-full h-80 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      <Card
        className={cn(
          "h-full flex flex-col overflow-hidden cursor-pointer hover:shadow-lg transition-shadow",
          className,
        )}
      >
        {hasPendingApplicants && (
          <div
            className="absolute top-2 left-2 w-5 h-5 rounded-full bg-orange-500 border-2 border-white shadow-md z-20"
            title="새로운 신청자가 있습니다"
          />
        )}
        {/* 상단: 모임 사진*/}
        <div className="relative w-full h-[60%]">
          {isMeetingClosed(meeting.currentParticipants, meeting.maxParticipants, meeting.meetingDate) && (
            <div className="absolute inset-0 z-10 bg-black/40 flex items-center justify-center">
              <span className="bg-black/60 text-white px-3 py-1.5 rounded-full text-sm font-bold border border-white/20">
                마감됨
              </span>
            </div>
          )}
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className={cn(
                "w-full h-full object-cover",
                isMeetingClosed(meeting.currentParticipants, meeting.maxParticipants, meeting.meetingDate) && "grayscale-[0.5]"
              )}
            />
          ) : (
            <img
              src={defaultMeetingImage}
              alt={title}
              className={cn(
                "w-full h-full object-cover",
                isMeetingClosed(meeting.currentParticipants, meeting.maxParticipants, meeting.meetingDate) && "grayscale-[0.5]"
              )}
            />
          )}
        </div>

        {/* 중간: 모임 제목 */}
        <CardHeader className="p-3 flex-grow">
          <CardTitle className="text-base font-semibold text-foreground line-clamp-1">
            {title}
          </CardTitle>
        </CardHeader>

        {/* 하단: 위치 및 참여자 수 */}
        <CardFooter className="p-3 pt-0 flex gap-4 items-center text-sm text-muted-foreground">
          <div className="flex items-center">
            <IoLocationOutline />
            <span>{getDistrictFromAddress(address)}</span>
          </div>
          <div className="flex items-center">
            <AiOutlineTeam />
            <span>{currentParticipants} 명</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

export default MeetingCard;
