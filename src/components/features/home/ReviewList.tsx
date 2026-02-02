import ReviewCard from "@/components/features/home/Review";
import type { Review } from "@/mock/reviewMock";

interface ReviewListProps {
  reviews: Review[];
}

const ReviewList = ({ reviews }: ReviewListProps) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3 justify-items-center">
      {reviews.map((review) => (
        <ReviewCard
          key={review.reviewId}
          meeting={review.meeting}
          imageUrl={review.imageUrl}
          rating={review.rating}
          content={review.content}
        />
      ))}
    </div>
  );
};

export default ReviewList;
