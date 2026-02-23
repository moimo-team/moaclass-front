import { useState } from 'react';

import { Link } from 'react-router-dom';

import type { GetMeetingsParams } from '@/api/meeting.api';
import MeetingList from '@/components/features/home/MeetingList';
import LoginRequiredDialog from '@/components/features/login/LoginRequiredDialog';
import CreateMeetingModal from '@/components/features/modal/create/CreateMeetingModal';
import { Button } from '@/components/ui/button';
import { useMeetingsQuery } from '@/hooks/useMeetingsQuery';
import { useAuthStore } from '@/store/authStore';

import { Skeleton } from '../../ui/skeleton';

interface MeetingListSectionProps {
	title: string;
	queryOptions: GetMeetingsParams;
	seeMoreHref?: string;
	hideIfEmpty?: boolean;
}

function MeetingListSection({
	title,
	queryOptions,
	seeMoreHref,
	hideIfEmpty = false,
}: MeetingListSectionProps) {
	const { nickname, isLoggedIn } = useAuthStore();
	const { data: meetingsResponse, isLoading, isError } = useMeetingsQuery(queryOptions);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [showLoginPrompt, setShowLoginPrompt] = useState(false);

	const meetings = meetingsResponse?.data || [];
	const safeNickname = nickname || '예비 모임장';
	const finalTitle = title.replace('{nickname}', safeNickname);

	const handleApplyClick = () => {
		if (!isLoggedIn) {
			setShowLoginPrompt(true);
			return;
		}
		setIsModalOpen(true);
	};

	if (hideIfEmpty && !isLoading && meetings.length === 0) {
		return null;
	}

	return (
		<div className="w-full max-w-6xl mx-auto py-8 pt-12">
			<div className="flex justify-between items-center w-full mb-6">
				<div className="flex items-center gap-4">
					<div className="text-2xl font-bold text-foreground">{finalTitle}</div>
					{title === '전체 모임' && (
						<Button
							variant="outline"
							onClick={handleApplyClick}
							className="border-primary text-primary hover:bg-primary hover:text-white rounded-lg px-5 py-2 h-auto text-sm font-semibold transition-all shadow-sm active:scale-95"
						>
							모임 개설하기
						</Button>
					)}
				</div>
				{seeMoreHref && (
					<Link
						to={seeMoreHref}
						className="text-sm cursor-pointer text-muted-foreground hover:text-primary transition-colors"
					>
						전체보기
					</Link>
				)}
			</div>
			{isLoading && (
				<div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3 justify-items-center">
					{[...Array(8)].map((_, index) => (
						<Skeleton key={index} className="w-full h-80 rounded-lg" />
					))}
				</div>
			)}
			{isError && (
				<p className="text-center text-red-500">모임을 불러오는 중 에러가 발생했습니다.</p>
			)}
			{!isLoading && !isError && meetings.length > 0 && <MeetingList meetings={meetings} />}
			{!isLoading && !isError && meetings.length === 0 && (
				<p className="text-center py-16 text-muted-foreground">모임이 없습니다.</p>
			)}

			<CreateMeetingModal open={isModalOpen} onOpenChange={setIsModalOpen} />
			<LoginRequiredDialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt} />
		</div>
	);
}

export default MeetingListSection;
