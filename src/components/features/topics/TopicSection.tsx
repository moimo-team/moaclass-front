import TopicCard from "@features/topics/TopicCard";
import { useInterestQuery } from "@/hooks/useInterestQuery";
import interest_all from '@/assets/images/interests/interest_all.webp';
import { useRef, useState, useEffect } from "react";

import { Skeleton } from "@/components/ui/skeleton";

function TopicSection() {
  const { data: interests, isLoading, error } = useInterestQuery();
  const containerRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(5);

  useEffect(() => {
    const updateColumns = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.offsetWidth;
      // 현재 gap 계산 (16px or 24px)
      const gap = parseInt(window.getComputedStyle(containerRef.current).columnGap) || 16;
      const minItemWidth = 120;

      // 한 줄에 들어가는 아이템 수 계산
      const calculatedCols = Math.floor((width + gap) / (minItemWidth + gap));
      setColumns(Math.max(1, calculatedCols));
    };

    updateColumns(); // 초기 계산

    const observer = new ResizeObserver(updateColumns);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [isLoading]); // content가 로드된 후 ref가 잡히므로 isLoading 의존성 추가 고려, 혹은 ref callback 사용이 더 안전하지만 여기선 간단히

  // 2줄 표시 (전체보기 포함을 위해 -1)
  const maxItems = columns * 2;
  const visibleInterests = interests?.slice(0, maxItems - 1) || [];

  if (isLoading) {
    return (
      <div className="py-4 pb-8 w-full max-w-screen-xl mx-auto px-4 md:px-8">
        <div
          ref={containerRef}
          className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-4 md:gap-6 justify-items-center"
        >
          {Array.from({ length: columns * 2 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center justify-center w-full max-w-[120px] p-2">
              <Skeleton className="w-full aspect-square rounded-full mb-2" />
              <Skeleton className="h-4 w-16 rounded-md bg-secondary/50" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) return <div>Error loading interests: {error.message}</div>;

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 md:px-8">
      <div
        ref={containerRef}
        className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-x-4 gap-y-6 md:gap-x-6 justify-items-center"
      >
        {visibleInterests.map((interest) => (
          <TopicCard
            key={interest.id}
            topicName={interest.name}
            to={`/meetings?interestFilter=${interest.id}`}
          />
        ))}
        <TopicCard
          topicName="전체보기"
          to="/interests"
          imageUrl={interest_all}
        />
      </div>
    </div>
  );
}

export default TopicSection;
