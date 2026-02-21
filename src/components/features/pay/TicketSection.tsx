import Image from 'next/image';

import type { PayPreviewResponse } from '@/models/pay.model';
import { formatFullDateTime } from '@/utils/dateFormat';

import { PaySectionCard } from './PaySectionCard';

interface TicketSectionProps {
	lesson: PayPreviewResponse['lessons'];
}

export const TicketSection = ({ lesson }: TicketSectionProps) => {
	return (
		<PaySectionCard title="클래스 티켓 정보">
			<div className="space-y-4">
				<div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
					<Image
						src={lesson.representativeImage}
						alt="Class Thumbnail"
						fill
						sizes="(max-width: 768px) 100vw, 50vw"
						className="object-cover"
					/>
				</div>
				<div className="space-y-3 text-sm">
					<div>
						<p className="text-muted-foreground font-semibold mb-0.5">클래스 명</p>
						<p className="font-medium text-base">{lesson.title}</p>
					</div>
					<div>
						<p className="text-muted-foreground font-semibold mb-0.5">일시</p>
						<p>{formatFullDateTime(lesson.schedule.startAt)}</p>
					</div>
					<div>
						<p className="text-muted-foreground font-semibold mb-0.5">장소</p>
						<p>{lesson.address}</p>
					</div>
				</div>
			</div>
		</PaySectionCard>
	);
};
