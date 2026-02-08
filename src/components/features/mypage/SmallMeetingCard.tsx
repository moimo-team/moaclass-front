import type { MyMeetingsResponse } from "@/api/me.api";
import { Card } from "@/components/ui/card";
import { getDisplayAddress } from "@/utils/formatAddress";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";

interface SmallMeetingCardProps {
  meeting: MyMeetingsResponse;
  children?: React.ReactNode;
  className?: string;
  hasPendingApplicants?: boolean;
}

const SmallMeetingCard = ({
  meeting,
  children,
  className,
  hasPendingApplicants,
}: SmallMeetingCardProps) => {
  return (
    <Card
      key={meeting.meetingId}
      className={`relative flex flex-col md:flex-row md:items-center p-4 md:p-6 transition-shadow border-none shadow-none gap-4 md:gap-0 
          ${className} ${meeting.status === "PENDING" || meeting.isCompleted
          ? "bg-gray-100"
          : "bg-white border border-gray-100 shadow-sm"
        }`}
    >
      {hasPendingApplicants && (
        <div
          className="absolute top-2 left-2 w-5 h-5 rounded-full bg-orange-500 border-2 border-white shadow-md z-10"
          title="새로운 신청자가 있습니다"
        />
      )}
      <div className="flex-1 w-full">
        <Link
          to={`/meetings/${meeting.meetingId}`}
          className="flex items-center gap-2 mb-2 md:mb-3"
        >
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
            {meeting.title}
          </h3>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-gray-500 text-sm">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="truncate max-w-[200px]">{getDisplayAddress(meeting.address)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 shrink-0" />
            {meeting.currentParticipants}/{meeting.maxParticipants}명
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4 shrink-0" />
            {format(meeting.meetingDate, "PPP", { locale: ko })}
          </div>
        </div>
      </div>
      <div className="flex gap-2 w-full md:w-auto justify-end">{children}</div>
    </Card>
  );
};

export default SmallMeetingCard;
