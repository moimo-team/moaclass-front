import Image from 'next/image';

import defaultMeetingImage from '@/assets/images/moimo-meetings.png';
import defaultProfileImage from '@/assets/images/profile.png';
import StarRating from '@/components/common/StarRating';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ReviewCardProps {
	lessonTitle: string;
	nickname: string;
	profileImage: string | null;
	representativeImage: string | null;
	className?: string;
	rating: number;
	content: string;
	onCardClick: () => void;
}

const ReviewCard = ({
	lessonTitle,
	nickname,
	profileImage,
	representativeImage,
	className,
	rating,
	content,
	onCardClick,
}: ReviewCardProps) => {
	const displayImage = representativeImage || defaultMeetingImage;
	const displayProfileImage = profileImage || defaultProfileImage;

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
				<div className="flex items-center gap-2 mt-2">
					<div className="relative w-6 h-6 rounded-full overflow-hidden border border-border/50 shrink-0">
						<Image
							src={displayProfileImage}
							alt={`${nickname} 프로필 이미지`}
							fill
							sizes="24px"
							className="object-cover"
						/>
					</div>
					<span className="text-xs text-foreground">{nickname}</span>
				</div>
			</CardContent>
		</Card>
	);
};

export default ReviewCard;
