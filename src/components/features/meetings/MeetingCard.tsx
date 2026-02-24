import { motion } from 'framer-motion';
import Image from 'next/image';
import { AiOutlineTeam } from 'react-icons/ai';
import { IoLocationOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';

import defaultMeetingImage from '@/assets/images/moaclass.png';
import { Card, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Meeting } from '@/models/meeting.model';
import { getDisplayAddress } from '@/utils/formatAddress';
import { isMeetingClosed } from '@/utils/meetingUtils';

interface MeetingCardProps {
	meeting: Meeting;
	imageUrl?: string;
	className?: string;
	hasPendingApplicants?: boolean;
}
function MeetingCard({ meeting, imageUrl, className, hasPendingApplicants }: MeetingCardProps) {
	const { meetingId, title, address, currentParticipants } = meeting;
	const href = `/meetings/${meetingId}`;
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: false, margin: '-50px' }}
			transition={{ duration: 0.5, ease: 'easeOut' }}
			className="w-full h-80"
		>
			<Link
				to={href}
				className="relative block w-full h-full rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
			>
				<Card
					className={cn(
						'h-full flex flex-col overflow-hidden cursor-pointer hover:shadow-lg transition-shadow',
						className,
					)}
				>
					{hasPendingApplicants && (
						<div
							className="absolute top-2 left-2 w-5 h-5 rounded-full bg-orange-500 border-2 border-white shadow-md z-20"
							title="새로운 신청자가 있습니다"
						/>
					)}
					{/* 상단: 모임 사진*/}
					<div className="relative w-full h-[60%]">
						{isMeetingClosed(
							meeting.currentParticipants,
							meeting.maxParticipants,
							meeting.meetingDate,
						) && (
							<div className="absolute inset-0 z-10 bg-black/40 flex items-center justify-center">
								<span className="bg-black/60 text-white px-3 py-1.5 rounded-full text-sm font-bold border border-white/20">
									마감됨
								</span>
							</div>
						)}
						<Image
							src={imageUrl || defaultMeetingImage}
							alt={title}
							fill
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
							className={cn(
								'w-full h-full object-cover',
								isMeetingClosed(
									meeting.currentParticipants,
									meeting.maxParticipants,
									meeting.meetingDate,
								) && 'grayscale-[0.5]',
							)}
						/>
					</div>

					{/* 중간: 모임 제목 */}
					<CardHeader className="p-3 flex-grow">
						<CardTitle className="text-base font-semibold text-foreground line-clamp-1">
							{title}
						</CardTitle>
					</CardHeader>

					{/* 하단: 위치 및 참여자 수 */}
					<CardFooter className="p-3 pt-0 flex gap-4 items-center text-sm text-muted-foreground border-t border-gray-50 mt-auto">
						<div className="flex items-center gap-1.5 transition-colors">
							<IoLocationOutline className="text-primary/70 shrink-0" size={16} />
							<span className="line-clamp-1">{getDisplayAddress(address)}</span>
						</div>
						<div className="flex items-center gap-1.5 transition-colors">
							<AiOutlineTeam className="text-primary/70 shrink-0" size={16} />
							<span>{currentParticipants} 명</span>
						</div>
					</CardFooter>
				</Card>
			</Link>
		</motion.div>
	);
}

export default MeetingCard;
