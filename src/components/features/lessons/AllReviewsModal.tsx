import React, { useState } from "react";
import type { Review } from "@/models/review.model";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ReviewItem } from "@/components/features/lessons/ReviewItem";
import PaginationComponent from "@/components/common/PaginationComponent";

interface AllReviewsModalProps {
  reviews: Review[];
  isOpen: boolean;
  onClose: () => void;
}

const REVIEWS_PER_PAGE = 5;

export const AllReviewsModal: React.FC<AllReviewsModalProps> = ({
  reviews,
  isOpen,
  onClose,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);

  const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
  const endIndex = startIndex + REVIEWS_PER_PAGE;
  const currentReviews = reviews.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">전체 후기</DialogTitle>
          <DialogDescription>
            이 클래스에 대한 모든 후기를 확인하세요.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
          {reviews.length === 0 ? (
            <p className="text-muted-foreground text-center">
              아직 후기가 없습니다.
            </p>
          ) : (
            <>
              {currentReviews.map((review) => (
                <ReviewItem key={review.id} review={review} />
              ))}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <PaginationComponent
                    page={currentPage}
                    totalPages={totalPages}
                    setPage={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
