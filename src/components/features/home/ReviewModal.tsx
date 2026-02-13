import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import StarRating from '@/components/common/StarRating';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
	type CarouselApi,
} from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import type { Review } from '@/mock/reviewMock';
import { formatRelativeTime } from '@/utils/dateFormat';

interface ReviewModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	review: Review;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ open, onOpenChange, review }) => {
	const [carouselApi, setCarouselApi] = useState<CarouselApi>();
	const [currentSlide, setCurrentSlide] = useState(0);

	useEffect(() => {
		if (!carouselApi) return;
		const handleSelect = () => {
			setCurrentSlide(carouselApi.selectedScrollSnap());
		};
		carouselApi.on('select', handleSelect);
		return () => {
			carouselApi.off('select', handleSelect);
		};
	}, [carouselApi]);

	const images = review.imageUrl || [];
	// TODO: 더미 이미지 삭제
	const dummyImages = [
		'https://via.placeholder.com/800x450/FFD700/FFFFFF?text=Review+1',
		'https://via.placeholder.com/800x450/ADD8E6/FFFFFF?text=Review+2',
		'https://via.placeholder.com/800x450/90EE90/FFFFFF?text=Review+3',
	];
	const displayImages = images.length > 0 ? images : dummyImages;

	// TODO: 더미 프로필 이미지 삭제
	const reviewerProfileImage = 'https://github.com/shadcn.png';

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			{/* 상단: 리뷰 이미지 */}
			<DialogContent className="w-full max-w-2xl h-[90vh] p-0 flex flex-col gap-0 overflow-hidden sm:rounded-lg">
				<div className="relative w-full h-1/2 bg-gray-100 shrink-0 overflow-hidden">
					<Carousel setApi={setCarouselApi} className="w-full h-full">
						<CarouselContent className="h-full ml-0">
							{displayImages.map((img, index) => (
								<CarouselItem key={index} className="h-full pl-0 relative">
									<img
										src={img}
										alt={`Review image ${index + 1}`}
										className="w-full h-full object-cover"
									/>
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-black/30 hover:bg-black/50 border-none text-white z-10" />
						<CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-black/30 hover:bg-black/50 border-none text-white z-10" />
					</Carousel>

					{displayImages.length > 1 && (
						<div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
							{displayImages.map((_, index) => (
								<button
									key={index}
									onClick={() => carouselApi?.scrollTo(index)}
									className={`w-1.5 h-1.5 rounded-full transition-all ${
										currentSlide === index ? 'bg-white w-3' : 'bg-white/60'
									}`}
									aria-label={`Go to slide ${index + 1}`}
								/>
							))}
						</div>
					)}
				</div>

				{/* 하단: 리뷰 내용 */}
				<div className="flex flex-col h-1/2 bg-white overflow-hidden">
					<div className="p-4 border-b shrink-0 flex items-center justify-between">
						<DialogTitle className="text-lg font-bold truncate mr-2">
							{review.title}
						</DialogTitle>
					</div>

					<div className="p-4 flex-grow overflow-y-auto scrollbar-hide">
						<div className="flex items-start justify-between mb-3">
							<div className="flex items-center gap-2">
								<Avatar className="h-8 w-8">
									<AvatarImage src={reviewerProfileImage} />
									<AvatarFallback>{review.reviewerName.charAt(0)}</AvatarFallback>
								</Avatar>
								<div>
									<p className="font-semibold text-sm">{review.reviewerName}</p>
									<div className="flex items-center text-xs text-gray-500">
										<span>{formatRelativeTime(review.createdAt)}</span>
									</div>
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
								to={`/meetings/${review.meeting.meetingId}`}
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
