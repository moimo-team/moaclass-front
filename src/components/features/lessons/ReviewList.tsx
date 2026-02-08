import React, { useState } from "react";
import type { Review } from "@/models/review.model";
import { ReviewItem } from "@/components/features/lessons/ReviewItem";
import { Button } from "@/components/ui/button";
import { AllReviewsModal } from "@/components/features/lessons/AllReviewsModal";

interface ReviewListProps {
  reviews: Review[];
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const REVIEWS_PER_PAGE = 5;

  const displayedReviews = reviews.slice(0, REVIEWS_PER_PAGE);
  const hasMoreReviews = reviews.length > REVIEWS_PER_PAGE;

  return (
    <div>
      {reviews.length === 0 ? (
        <p className="text-muted-foreground">아직 후기가 없습니다.</p>
      ) : (
        <div className="space-y-6">
          {displayedReviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
          {hasMoreReviews && (
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => setIsModalOpen(true)}
            >
              더보기 ({reviews.length}개)
            </Button>
          )}
        </div>
      )}

      {isModalOpen && (
        <AllReviewsModal
          reviews={reviews}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};
