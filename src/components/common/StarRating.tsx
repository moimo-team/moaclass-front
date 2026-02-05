import React from "react";
import { IoMdStarOutline, IoMdStar, IoMdStarHalf } from "react-icons/io";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number; // 0.5 ~ 5.0
  starSize?: number;
  className?: string;
  filledColor?: string; // 채워진 별 색상 (기본값 text-yellow-400)
  emptyColor?: string; // 빈 별 색상 (기본값 text-gray-300)
  onChange?: (rating: number) => void;
  isEditable?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  starSize = 20,
  className,
  filledColor = "text-yellow-400",
  emptyColor = "text-gray-300",
  onChange,
  isEditable = false,
}) => {
  const [hoverRating, setHoverRating] = React.useState(0);

  const displayRating = isEditable && hoverRating > 0 ? hoverRating : rating;

  const handleMouseMove = (e: React.MouseEvent<SVGElement>, index: number) => {
    if (!isEditable) return;
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const isHalf = e.clientX - left < width / 2;
    setHoverRating(index + (isHalf ? 0.5 : 1));
  };

  const handleClick = (e: React.MouseEvent<SVGElement>, index: number) => {
    if (!isEditable || !onChange) return;
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const isHalf = e.clientX - left < width / 2;
    onChange(index + (isHalf ? 0.5 : 1));
  };

  const stars = [];
  for (let i = 0; i < 5; i++) {
    const starValue = i + 1;
    let StarIcon = IoMdStarOutline;
    let isFilled = false;

    if (displayRating >= starValue) {
      StarIcon = IoMdStar;
      isFilled = true;
    } else if (displayRating >= starValue - 0.5) {
      StarIcon = IoMdStarHalf;
      isFilled = true;
    }

    stars.push(
      <StarIcon
        key={i}
        className={cn(
          isFilled ? filledColor : emptyColor,
          isEditable && "cursor-pointer transition-transform hover:scale-110",
        )}
        size={starSize}
        onMouseMove={(e) => handleMouseMove(e, i)}
        onMouseLeave={() => isEditable && setHoverRating(0)}
        onClick={(e) => handleClick(e, i)}
      />,
    );
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>{stars}</div>
  );
};

export default StarRating;
