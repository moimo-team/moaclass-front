import Image from 'next/image';

import defaultMeetingImage from '@/assets/images/moaclass.png';
import StarRating from '@/components/common/StarRating';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ReviewCardProps {
	lessonTitle: string;
	representativeImage: string | null;
	className?: string;
	rating: number;
	content: string;
	onCardClick: () => void;
}

const ReviewCard = ({
	lessonTitle,
	representativeImage,
	className,
	rating,
	content,
	onCardClick,
}: ReviewCardProps) => {
	const displayImage = representativeImage || defaultMeetingImage;

	return (
		<Card
			className={cn(
				'h-full flex flex-col overflow-hidden cursor-pointer hover:shadow-lg transition-shadow',
				className,
			)}
			onClick={onCardClick}
		>
			{/* 상단: 후기 이미지*/}
			<div className="relative w-full h-[70%]">
				<Image
					src={displayImage}
					alt={lessonTitle}
					fill
					sizes="(max-width: 768px) 100vw, 33vw"
					className="w-full h-full object-cover"
				/>
			</div>

			{/* 중간: 별점 */}
			<CardHeader className="p-3 pb-0 flex-grow">
				<CardTitle className="text-base font-semibold text-foreground line-clamp-1 mb-1">
					{lessonTitle}
				</CardTitle>
				<StarRating rating={rating} />
			</CardHeader>

			{/* 하단: 후기 내용 일부 */}
			<CardContent className="p-3 pt-0 text-sm text-muted-foreground flex-grow">
				<p className="line-clamp-2 mb-2">{content}</p>
			</CardContent>
		</Card>
	);
};

export default ReviewCard;
