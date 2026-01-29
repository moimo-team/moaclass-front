import { Link } from "react-router-dom";
import { interestImageMap } from "@/utils/interestImageMap";

interface TopicCardProps {
  topicName: string;
  to: string;
  imageUrl?: string;
}

function TopicCard({
  topicName,
  to,
  imageUrl = interestImageMap[topicName],
}: TopicCardProps) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center justify-center transition-colors cursor-pointer hover:bg-accent/50 p-2 w-full max-w-[120px]"
    >
      <div className="w-full aspect-square rounded-full bg-secondary flex items-center justify-center overflow-hidden mb-2 border border-yellow-500">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={topicName}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="font-semibold text-primary-foreground text-xl">
            {topicName.charAt(0)}
          </span>
        )}
      </div>
      <p className="font-medium text-center text-sm mt-1 whitespace-nowrap overflow-hidden text-ellipsis w-full px-1">{topicName}</p>
    </Link>
  );
}

export default TopicCard;
