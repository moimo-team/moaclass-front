import ReviewCard from "@/components/features/home/Review";
import type { Review } from "@/mock/reviewMock";

interface ReviewListProps {
  reviews: Review[];
  onReviewClick: (review: Review) => void;
}

const ReviewList = ({ reviews, onReviewClick }: ReviewListProps) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3 justify-items-center">
      {reviews.map((review) => (
        <ReviewCard
          key={review.reviewId}
          meeting={review.meeting}
          imageUrls={review.imageUrl}
          rating={review.rating}
          content={review.content}
          onCardClick={() => onReviewClick(review)}
        />
      ))}
    </div>
  );
};

export default ReviewList;
