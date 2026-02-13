import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { IoLocationOutline } from "react-icons/io5";
import { IoIosHeartEmpty, IoIosHeart } from "react-icons/io";
import { Link } from "react-router-dom";
import type { Lesson } from "@/models/lesson.model";
import { getDisplayAddress } from "@/utils/formatAddress";
import defaultLessonImage from "@/assets/images/moimer-intro.png";
import defaultProfileImage from "@/assets/images/profile.png";
import { ClassInfoBody } from "@/components/common/ClassInfoBody";
import { useLessonLikeMutation } from "@/hooks/useLessonLikeMutation";
import type { QueryKey } from "@tanstack/react-query";

interface LessonCardProps {
  lesson: Lesson;
  className?: string;
  queryKeyToInvalidate?: QueryKey;
  onToggleLike?: (lessonId: number, isLiked: boolean) => void;
}

export function LessonCard({
  lesson,
  className,
  queryKeyToInvalidate = ["lessons"],
  onToggleLike,
}: LessonCardProps) {
  const { id, title, address, isLiked } = lesson;
  const href = `/lessons/${id}`;

  const { mutate: toggleLike, isPending: isLiking } = useLessonLikeMutation([
    queryKeyToInvalidate,
  ]);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onToggleLike) {
      onToggleLike(id, isLiked ?? false);
    } else {
      toggleLike({ lessonId: id, newIsLiked: !isLiked });
    }
  };

  return (
    <Link
      to={href}
      className="relative block w-full h-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      <Card
        className={cn(
          "h-full flex flex-col overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 bg-white border border-gray-100 group",
          className,
        )}
      >
        {/* 상단: 클래스 사진  */}
        <div className="relative w-full aspect-[4/2.8] overflow-hidden bg-muted">
          <img
            src={lesson.representativeImage || defaultLessonImage}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* 좋아요 아이콘 */}
          <button
            type="button"
            className={cn(
              "absolute top-2 right-2 z-20 cursor-pointer p-1 rounded-full hover:bg-black/10 transition-colors",
              isLiking && "pointer-events-none opacity-70 animate-pulse",
            )}
            onClick={handleLikeClick}
            aria-label={isLiked ? "좋아요 취소" : "좋아요"}
          >
            {isLiked ? (
              <IoIosHeart className="text-red-500 text-2xl drop-shadow-sm" />
            ) : (
              <IoIosHeartEmpty className="text-white text-2xl drop-shadow-lg" />
            )}
          </button>
        </div>

        {/* 정보 섹션 */}
        <div className="p-3 flex flex-col gap-2.5 flex-1">
          <div className="space-y-1.5">
            {/* 평점, 좋아요, 지역 위치 정보 */}
            <div className="flex justify-between items-center text-[10px] text-gray-500 font-medium">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-0.5">
                  ⭐ {lesson.rate.toFixed(1)}
                </span>
                <span className="flex items-center gap-0.5">
                  ❤️ {lesson.likeCount}
                </span>
              </div>
              <div className="flex items-center gap-0.5">
                <IoLocationOutline className="w-3 h-3 text-primary/60" />
                <span>{getDisplayAddress(address)}</span>
              </div>
            </div>

            <ClassInfoBody
              title={title}
              category={lesson.classCategory?.name || "전체"}
              price={lesson.price}
              discountRate={lesson.discountRate}
              discountedPrice={lesson.discountedPrice}
              showDate={false}
              titleClassName="text-[16px] line-clamp-1"
              className="gap-1.5"
            />
          </div>

          {/* 모멘토 프로필 */}
          <div className="flex items-center gap-2 pt-3 border-t border-gray-50 mt-auto">
            <div className="w-5 h-5 rounded-full overflow-hidden border border-gray-100 shrink-0">
              <img
                src={lesson.teacher.image || defaultProfileImage}
                alt={lesson.teacher.nickname || "모멘토"}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs font-medium text-gray-600 truncate">
              {lesson.teacher.nickname || "모멘토"}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default LessonCard;
