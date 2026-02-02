import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Meeting } from "@/models/meeting.model";
import defaultMeetingImage from "@/assets/images/moimo-meetings.png";
import StarRating from "@/components/common/StarRating";

interface ReviewCardProps {
  meeting: Meeting;
  imageUrls?: string[];
  className?: string;
  rating: number;
  content: string;
  onCardClick: () => void;
}

const ReviewCard = ({
  meeting,
  imageUrls,
  className,
  rating,
  content,
  onCardClick,
}: ReviewCardProps) => {
  const { title } = meeting;

  const displayImage =
    imageUrls && imageUrls.length > 0 ? imageUrls[0] : defaultMeetingImage;

  return (
    <Card
      className={cn(
        "h-full flex flex-col overflow-hidden cursor-pointer hover:shadow-lg transition-shadow",
        className,
      )}
      onClick={onCardClick}
    >
      {/* 상단: 후기 이미지*/}
      <div className="relative w-full h-[70%]">
        <img
          src={displayImage}
          alt={title}
          className={"w-full h-full object-cover"}
        />
      </div>

      {/* 중간: 별점 */}
      <CardHeader className="p-3 pb-0 flex-grow">
        <CardTitle className="text-base font-semibold text-foreground line-clamp-1 mb-1">
          <StarRating rating={rating} />
        </CardTitle>
      </CardHeader>

      {/* 하단: 후기 내용 일부 */}
      <CardContent className="p-3 pt-0 text-sm text-muted-foreground flex-grow">
        <p className="line-clamp-2 mb-2">{content}</p>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
