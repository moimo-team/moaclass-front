import { FaClock, FaMapMarkerAlt, FaRegHeart, FaTachometerAlt, FaUsers } from 'react-icons/fa';

import StarRating from '@/components/common/StarRating';
import { Badge } from '@/components/ui/badge';
import { getLevelDisplayName } from '@/constants/lessonConstants';
import type { Level } from '@/models/lesson.model';
import { getDisplayAddress } from '@/utils/formatAddress';

interface LessonHeaderProps {
	title: string;
	classCategoryName: string | undefined;
	subClassCategories: { id: number; name: string }[] | undefined;
	likes: number;
	rate: number;
	durationMin: number;
	address: string;
	level: Level;
	maxParticipants: number | undefined;
}

export const LessonHeader = ({
	title,
	classCategoryName,
	subClassCategories,
	likes,
	rate,
	durationMin,
	address,
	level,
	maxParticipants,
}: LessonHeaderProps) => {
	return (
		<>
			{/* 클래스 헤더 섹션 */}
			<section className="space-y-4">
				<div className="flex flex-wrap gap-2">
					<Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-base px-3 py-1.5 font-medium border-primary/20">
						{classCategoryName || '카테고리 없음'}
					</Badge>
					{subClassCategories &&
						subClassCategories.length > 0 &&
						subClassCategories.map((subCat) => (
							<Badge
								key={subCat.id}
								variant="default"
								className="bg-muted text-foreground/70 hover:bg-muted/80 text-base px-3 py-1.5 font-medium border-border/50"
							>
								{subCat.name}
							</Badge>
						))}
				</div>
				<h1 className="text-4xl font-bold text-foreground">{title}</h1>
				<div className="flex items-center gap-4 text-lg text-foreground/80">
					<div className="flex items-center gap-1">
						<FaRegHeart className="text-red-500" />
						<span>{likes}</span>
					</div>
					<div className="flex items-center gap-1">
						<StarRating rating={rate} starSize={20} />
						<span>{rate.toFixed(1)}</span>
					</div>
				</div>
			</section>

			<section className="flex flex-wrap items-center gap-x-6 gap-y-2 text-lg text-foreground/80 py-4 border-y border-border/50">
				<div className="flex items-center gap-2">
					<FaClock className="text-primary" />
					<span>{durationMin}분</span>
				</div>
				<div className="flex items-center gap-2">
					<FaMapMarkerAlt className="text-primary" />
					<span>{getDisplayAddress(address)}</span>{' '}
				</div>
				<div className="flex items-center gap-2">
					<FaTachometerAlt className="text-primary" />
					<span>{getLevelDisplayName(level)}</span>
				</div>
				<div className="flex items-center gap-2">
					<FaUsers className="text-primary" />
					<span>최대 {maxParticipants}명</span>
				</div>
			</section>
		</>
	);
};
