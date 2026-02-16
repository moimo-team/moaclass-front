import React from 'react';

import { Link } from 'react-router-dom';

import defaultMeetingImage from '@/assets/images/moimo-meetings.png';
import StarRating from '@/components/common/StarRating';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import type { LatestReviewItem } from '@/models/review.model';

interface ReviewModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	review: LatestReviewItem;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ open, onOpenChange, review }) => {
	const displayImage = review.representativeImage || defaultMeetingImage;
	const reviewerProfileImage = 'https://github.com/shadcn.png';

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			{/* 상단: 리뷰 이미지 */}
			<DialogContent className="w-full max-w-2xl h-[90vh] p-0 flex flex-col gap-0 overflow-hidden sm:rounded-lg">
				<div className="relative w-full h-1/2 bg-gray-100 shrink-0 overflow-hidden">
					<img
						src={displayImage}
						alt={review.lessonTitle}
						className="w-full h-full object-cover"
					/>
				</div>

				{/* 하단: 리뷰 내용 */}
				<div className="flex flex-col h-1/2 bg-white overflow-hidden">
					<div className="p-4 border-b shrink-0 flex items-center justify-between">
						<DialogTitle className="text-lg font-bold truncate mr-2">
							{review.lessonTitle}
						</DialogTitle>
					</div>

					<div className="p-4 flex-grow overflow-y-auto scrollbar-hide">
						<div className="flex items-start justify-between mb-3">
							<div className="flex items-center gap-2">
								<Avatar className="h-8 w-8">
									<AvatarImage src={reviewerProfileImage} />
									<AvatarFallback>
										{String(review.userId).charAt(0)}
									</AvatarFallback>
								</Avatar>
								<div>
									<p className="font-semibold text-sm">User {review.userId}</p>
								</div>
							</div>
							<StarRating rating={review.rating} starSize={16} />
						</div>

						<p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
							{review.content}
						</p>
					</div>

					<DialogFooter className="p-3 border-t bg-gray-50 shrink-0 sm:justify-end items-center">
						<div className="flex gap-2 w-full sm:w-auto">
							<Link
								to={`/lessons/${review.lessonId}`}
								className="flex-1 sm:flex-none"
							>
								<Button size="sm" className="w-full">
									클래스 보러가기
								</Button>
							</Link>
							<Button
								variant="outline"
								size="sm"
								onClick={() => onOpenChange(false)}
								className="flex-1 sm:flex-none"
							>
								닫기
							</Button>
						</div>
					</DialogFooter>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ReviewModal;
