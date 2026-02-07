import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import moimoMeeting from "@/assets/images/moimo-meetings.png";

interface LessonGalleryProps {
  title: string;
  lessonImages: Array<{ id: number; image: string }> | undefined;
}

export const LessonGallery = ({
  title,
  lessonImages,
}: LessonGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(() => {
    const hasImages = lessonImages && lessonImages.length > 0;
    return hasImages ? 0 : -1;
  });

  const currentMainImage = useMemo(() => {
    return lessonImages &&
      lessonImages.length > 0 &&
      activeIndex !== -1 &&
      activeIndex < lessonImages.length
      ? lessonImages[activeIndex].image
      : moimoMeeting;
  }, [lessonImages, activeIndex]);


  const goToPrevImage = () => {
    if (!lessonImages || lessonImages.length <= 1) return;

    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? lessonImages.length - 1 : prevIndex - 1,
    );
  };

  const goToNextImage = () => {
    if (!lessonImages || lessonImages.length <= 1) return;

    setActiveIndex((prevIndex) =>
      prevIndex === lessonImages.length - 1 ? 0 : prevIndex + 1,
    );
  };

  return (
    <>
      {/* 이미지 섹션 */}
      <section>
        <div className="relative w-full aspect-video md:aspect-[16/9] rounded-xl overflow-hidden bg-muted shadow-sm border border-border/50">
          <img
            src={currentMainImage}
            alt={title}
            className="w-full h-full object-cover transition-opacity duration-300 ease-in-out"
          />
          {lessonImages && lessonImages.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50"
                onClick={goToPrevImage}
              >
                <FaChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50"
                onClick={goToNextImage}
              >
                <FaChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}
        </div>
        {lessonImages && lessonImages.length > 1 && (
          <div className="mt-4 relative">
            <div className="flex space-x-2 overflow-x-auto py-2 scrollbar-hide">
              {lessonImages.map((img, index) => (
                <img
                  key={img.id}
                  src={img.image}
                  alt={title}
                  className={cn(
                    "w-24 h-16 object-cover rounded-md cursor-pointer border-2 transition-all duration-200",
                    activeIndex === index
                      ? "border-primary"
                      : "border-transparent opacity-70 hover:opacity-100",
                  )}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
};
