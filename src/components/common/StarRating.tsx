import React from "react";
import { IoMdStarOutline, IoMdStar } from "react-icons/io";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number; // 1 ~ 5
  starSize?: number;
  className?: string;
  filledColor?: string; // 채워진 별 색상 (기본값 text-yellow-400)
  emptyColor?: string; // 빈 별 색상 (기본값 text-gray-300)
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  starSize = 20,
  className,
  filledColor = "text-yellow-400",
  emptyColor = "text-gray-300",
}) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(
        <IoMdStar key={i} className={cn(filledColor)} size={starSize} />,
      );
    } else {
      stars.push(
        <IoMdStarOutline key={i} className={cn(emptyColor)} size={starSize} />,
      );
    }
  }

  return <div className={cn("flex items-center", className)}>{stars}</div>;
};

export default StarRating;
