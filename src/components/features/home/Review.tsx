import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { IoMdStarOutline, IoMdStar } from "react-icons/io";
import { Link } from "react-router-dom";
import type { Meeting } from "@/models/meeting.model";
import defaultMeetingImage from "@/assets/images/moimo-meetings.png";

interface ReviewCardProps {
  meeting: Meeting;
  imageUrl?: string;
  className?: string;
  rating: number;
  content: string;
}

const ReviewCard = ({
  meeting,
  imageUrl,
  className,
  rating,
  content,
}: ReviewCardProps) => {
  const { meetingId, title } = meeting;
  const href = `/meetings/${meetingId}`;

  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<IoMdStar key={i} className="text-yellow-400" />); // 채워진 별
    } else {
      stars.push(<IoMdStarOutline key={i} className="text-gray-300" />); // 빈 별
    }
  }

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
        {/* 상단: 후기 사진*/}
        <div className="relative w-full h-[70%]">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className={"w-full h-full object-cover"}
            />
          ) : (
            <img
              src={defaultMeetingImage}
              alt={title}
              className={"w-full h-full object-cover"}
            />
          )}
        </div>

        {/* 중간: 별점 */}
        <CardHeader className="p-3 pb-0 flex-grow">
          <CardTitle className="text-base font-semibold text-foreground line-clamp-1 mb-1">
            <div className="flex items-center">{stars}</div>
          </CardTitle>
        </CardHeader>

        {/* 하단: 후기 내용 일부 */}
        <CardContent className="p-3 pt-0 text-sm text-muted-foreground flex-grow">
          <p className="line-clamp-2 mb-2">{content}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ReviewCard;
