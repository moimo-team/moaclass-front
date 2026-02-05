import { cn } from "@/lib/utils";
import { Card, CardTitle, CardFooter } from "@/components/ui/card";
import { IoLocationOutline } from "react-icons/io5";
import { IoIosHeartEmpty, IoIosHeart } from "react-icons/io";
import { Link } from "react-router-dom";
import type { Lesson } from "@/models/lesson.model";
import { getDisplayAddress } from "@/utils/formatAddress";
import defaultLessonImage from "@/assets/images/moimer-intro.png";
import defaultProfileImage from "@/assets/images/profile.png";

interface LessonCardProps {
  lesson: Lesson;
  className?: string;
  onToggleLike?: (lessonId: number, isLiked: boolean) => void;
}

function LessonCard({ lesson, className, onToggleLike }: LessonCardProps) {
  const { id, title, address, isLiked } = lesson;
  const href = `/lessons/${id}`; // TODO: URL 확정되면 수정

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleLike) {
      onToggleLike(id, !isLiked);
    }
  };

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
        {/* 상단: 클래스 사진 */}
        <div className="relative w-full h-[60%]">
          <img
            src={lesson.representativeImage || defaultLessonImage}
            alt={title}
            className="w-full h-full object-cover"
          />

          {/* 좋아요 아이콘 */}
          <div
            className="absolute top-2 right-2 z-20 cursor-pointer"
            onClick={handleLikeClick}
          >
            {isLiked ? (
              <IoIosHeart className="text-red-500 text-3xl" />
            ) : (
              <IoIosHeartEmpty className="text-red-500 text-3xl" />
            )}
          </div>
        </div>

        {/* 중간: 카테고리, 평점, 좋아요 수, 모멘토 정보 */}
        <div className="p-3 flex flex-col gap-1">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span className="font-semibold">
              {lesson.classCategory?.name || "원데이클래스"}
            </span>
            <div className="flex items-center gap-1">
              <span>⭐️ {lesson.rate.toFixed(1)}</span>
              <span>❤️ {lesson.likes}</span>
            </div>
          </div>
          {/* 모멘토 프로필 이미지, 닉네임 */}
          <div className="flex items-center gap-2 mt-1">
            <img
              src={
                lesson.teacherProfileImages?.[0]?.imageUrl ||
                defaultProfileImage
              }
              alt={lesson.teacherProfile?.nickname || "모멘토"}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-sm font-medium text-gray-700">
              {lesson.teacherProfile?.nickname || "모멘토"}
            </span>
          </div>
        </div>

        {/* 하단: 클래스 제목, 지역, 가격 */}
        <CardFooter className="p-3 pt-0 flex flex-col items-start text-sm">
          <CardTitle className="text-base font-semibold text-foreground line-clamp-1 mb-1">
            {title}
          </CardTitle>
          <div className="flex justify-between items-center w-full mb-1">
            <div className="flex items-center text-muted-foreground gap-1">
              <IoLocationOutline />
              <span>{getDisplayAddress(address)}</span>
            </div>
            <div className="text-md font-bold">
              {lesson.price.toLocaleString()}원
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

export default LessonCard;
