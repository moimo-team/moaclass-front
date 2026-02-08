import React, { useState, useRef, useEffect } from "react";
import type { Review } from "@/models/review.model";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StarRating from "@/components/common/StarRating";
import { formatDateToYYYYMMDD_DOT } from "@/utils/dateFormat";
import { cn } from "@/lib/utils";

interface ReviewItemProps {
  review: Review;
}

export const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const [showReadMoreButton, setShowReadMoreButton] = useState(false);
  const contentRef = useRef<HTMLParagraphElement>(null);

  // 후기 내용이 2줄을 넘어가는지 계산
  useEffect(() => {
    if (contentRef.current) {
      const lineHeight = parseFloat(
        getComputedStyle(contentRef.current).lineHeight,
      );
      const maxHeight = lineHeight * 2;
      const calculatedShouldShowButton =
        contentRef.current.scrollHeight > maxHeight;

      // 실제로 변경이 필요할 때만 상태 변경
      setShowReadMoreButton((prev) => {
        if (prev === calculatedShouldShowButton) {
          return prev;
        }
        return calculatedShouldShowButton;
      });
    }
  }, [review.content]);

  const toggleShowFullContent = () => {
    setShowFullContent((prev) => !prev);
  };

  return (
    <div className="flex border-b border-border/50 pb-4 mb-4 last:border-b-0 last:mb-0">
      {/* 왼쪽: 사용자 정보 및 후기 내용 */}
      <div className="flex-1 pr-4">
        <div className="flex items-center gap-3 mb-2">
          <Avatar className="w-10 h-10 border border-border">
            <AvatarImage
              src={review.user.profileImage || undefined}
              alt={review.user.nickname}
            />
            <AvatarFallback>{review.user.nickname.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">
              {review.user.nickname}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatDateToYYYYMMDD_DOT(review.createdAt)}
            </p>
          </div>
        </div>
        <div className="mb-2">
          <StarRating rating={review.rating} />
        </div>
        <p
          ref={contentRef}
          className={cn(
            "text-base text-foreground leading-relaxed",
            !showFullContent && "line-clamp-2",
          )}
        >
          {review.content}
        </p>
        {showReadMoreButton && (
          <div className="flex justify-end w-full">
            <button
              onClick={toggleShowFullContent}
              className="text-primary text-sm mt-1 hover:underline focus:outline-none"
            >
              {showFullContent ? "간략히 보기" : "더보기"}
            </button>
          </div>
        )}
      </div>

      {/* 오른쪽: 후기 이미지 */}
      <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
        {review.representativeImage ? (
          <img
            src={review.representativeImage}
            alt="Review Image"
            className="w-full h-full object-cover rounded-md border border-border"
          />
        ) : (
          <div className="w-full h-fullflex items-center justify-center text-muted-foreground text-sm"></div>
        )}
      </div>
    </div>
  );
};
