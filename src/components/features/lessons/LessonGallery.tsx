import { useState, useMemo } from 'react';

import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import moimoMeeting from '@/assets/images/moimo-meetings.png';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { LessonImage } from '@/models/lesson.model';

interface LessonGalleryProps {
	title: string;
	images: LessonImage[] | undefined;
}

export const LessonGallery = ({ title, images }: LessonGalleryProps) => {
	const [activeIndex, setActiveIndex] = useState(() => {
		const hasImages = images && images.length > 0;
		return hasImages ? 0 : -1;
	});

	const currentMainImage = useMemo(() => {
		return images && images.length > 0 && activeIndex !== -1 && activeIndex < images.length
			? images[activeIndex].image
			: moimoMeeting;
	}, [images, activeIndex]);

	const goToPrevImage = () => {
		if (!images || images.length <= 1) return;

		setActiveIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
	};

	const goToNextImage = () => {
		if (!images || images.length <= 1) return;

		setActiveIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
	};

	return (
		<>
			{/* 이미지 섹션 */}
			<section>
				<div className="relative w-full aspect-video md:aspect-[16/9] rounded-xl overflow-hidden bg-muted shadow-sm border border-border/50">
					<Image
						src={currentMainImage}
						alt={title}
						fill
						sizes="(max-width: 768px) 100vw, 1200px"
						className="w-full h-full object-cover transition-opacity duration-300 ease-in-out"
					/>
					{images && images.length > 1 && (
						<>
							<Button
								variant="ghost"
								size="icon"
								className="absolute left-2 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50"
								onClick={goToPrevImage}
							>
								<FaChevronLeft className="h-6 w-6" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50"
								onClick={goToNextImage}
							>
								<FaChevronRight className="h-6 w-6" />
							</Button>
						</>
					)}
				</div>
				{images && images.length > 1 && (
					<div className="mt-4 relative">
						<div className="flex space-x-2 overflow-x-auto py-2 scrollbar-hide">
							{images.map((img, index) => (
								<Image
									key={img.id}
									src={img.image}
									alt={title}
									width={96}
									height={64}
									className={cn(
										'w-24 h-16 object-cover rounded-md cursor-pointer border-2 transition-all duration-200',
										activeIndex === index
											? 'border-primary'
											: 'border-transparent opacity-70 hover:opacity-100',
									)}
									onClick={() => setActiveIndex(index)}
								/>
							))}
						</div>
					</div>
				)}
			</section>
		</>
	);
};
