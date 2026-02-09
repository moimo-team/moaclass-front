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

interface LessonCardProps {
  lesson: Lesson;
  className?: string;
}

export function LessonCard({ lesson, className }: LessonCardProps) {
  const { id, title, address, isLiked } = lesson;
  const href = `/lessons/${id}`;

  const { mutate: toggleLike, isPending: isLiking } = useLessonLikeMutation([
    ["lessons"],
  ]);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    toggleLike({ lessonId: id, newIsLiked: !isLiked });
  };

  return (
    <Link
      to={href}
      className="relative block w-full h-[380px] rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      <Card
        className={cn(
          "h-full flex flex-col overflow-hidden cursor-pointer hover:shadow-lg transition-shadow bg-white",
          className,
        )}
      >
        {/* 상단: 클래스 사진 */}
        <div className="relative w-full h-[55%]">
          <img
            src={lesson.representativeImage || defaultLessonImage}
            alt={title}
            className="w-full h-full object-cover"
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
              <IoIosHeart className="text-red-500 text-3xl" />
            ) : (
              <IoIosHeartEmpty className="text-white text-3xl drop-shadow-md" />
            )}
          </button>
        </div>

        {/* 정보 섹션 */}
        <div className="p-4 flex flex-col gap-3 flex-1 justify-between">
          <div className="space-y-3">
            {/* 평점, 좋아요, 지역 위치 정보 */}
            <div className="flex justify-between items-center text-[11px] text-gray-500">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-0.5">
                  ⭐ {lesson.rate.toFixed(1)}
                </span>
                <span className="flex items-center gap-0.5">
                  ❤️ {lesson.likes}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <IoLocationOutline className="w-3 h-3 text-primary" />
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
              titleClassName="text-base"
            />
          </div>

          {/* 모멘토 프로필 */}
          <div className="flex items-center gap-2 pt-3 border-t border-gray-100 mt-auto">
            <div className="w-5 h-5 rounded-full overflow-hidden border border-gray-200">
              <img
                src={lesson.teacherProfile?.image || defaultProfileImage}
                alt={lesson.teacherProfile?.nickname || "모멘토"}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs font-medium text-gray-600">
              {lesson.teacherProfile?.nickname || "모멘토"}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default LessonCard;
