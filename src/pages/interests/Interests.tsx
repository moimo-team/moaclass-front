import TopicCard from "@features/topics/TopicCard";
import { useInterestQuery } from "@/hooks/useInterestQuery";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const Interests = () => {
  const { data: interests, isLoading, error } = useInterestQuery();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="w-full h-full pt-10 bg-white overflow-y-auto max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="flex items-center gap-2 mb-8">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-x-4 gap-y-8 md:gap-x-6">
          {Array.from({ length: 24 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center p-2">
              <Skeleton className="w-full aspect-square rounded-full mb-2" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) return <div>Error loading interests: {error.message}</div>;

  return (
    <div className="w-full h-full pt-10 bg-white overflow-y-auto max-w-screen-xl mx-auto px-4 md:px-8">
      <div className="flex items-center gap-2 mb-8">
        <button
          onClick={handleBack}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="뒤로 가기"
        >
          <ChevronLeft className="w-8 h-8 text-gray-900" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">관심사 모두보기</h1>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-x-4 gap-y-8 md:gap-x-6">
        {interests?.map((interest) => (
          <TopicCard
            key={interest.id}
            topicName={interest.name}
            to={`/meetings?interestFilter=${interest.id}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Interests;
