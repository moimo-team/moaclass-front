import LessonCard from "@/components/features/lessons/LessonCard";
import type { Lesson } from "@/models/lesson.model";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import type { QueryKey } from "@tanstack/react-query";

export interface LessonListProps {
  lessons: Lesson[];
  queryKeyToInvalidate?: QueryKey;
}

const LessonList = ({ lessons, queryKeyToInvalidate }: LessonListProps) => {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 5000,
        }),
      ]}
      className="w-full max-w-sm sm:max-w-md md:max-w-full mx-auto"
    >
      <CarouselContent className="-ml-3">
        {lessons.map((lesson) => (
          <CarouselItem
            key={lesson.id}
            className="pl-3 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
          >
            <div className="p-1">
              <LessonCard
                lesson={lesson}
                queryKeyToInvalidate={queryKeyToInvalidate}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default LessonList;
