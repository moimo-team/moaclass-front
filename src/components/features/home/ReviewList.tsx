import Autoplay from 'embla-carousel-autoplay';

import ReviewCard from '@/components/features/home/Review';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselPrevious,
	CarouselNext,
} from '@/components/ui/carousel';
import type { LatestReviewItem } from '@/models/review.model';

interface ReviewListProps {
	reviews: LatestReviewItem[];
	onReviewClick: (review: LatestReviewItem) => void;
}

const ReviewList = ({ reviews, onReviewClick }: ReviewListProps) => {
	return (
		<Carousel
			opts={{
				align: 'start',
				loop: true,
			}}
			plugins={[
				Autoplay({
					delay: 4000,
				}),
			]}
			className="w-full max-w-sm sm:max-w-md md:max-w-full mx-auto"
		>
			<CarouselContent className="-ml-3">
				{reviews.map((review) => (
					<CarouselItem key={review.id} className="pl-3 md:basis-1/3 lg:basis-1/4">
						<div className="p-1">
							<ReviewCard
								className="h-80"
								lessonTitle={review.lessonTitle}
								representativeImage={review.representativeImage}
								rating={review.rating}
								content={review.content}
								onCardClick={() => onReviewClick(review)}
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

export default ReviewList;
