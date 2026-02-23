import { useState, useLayoutEffect, useEffect } from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { joinChatRoom } from '@/api/chat.api';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { LessonGallery } from '@/components/features/lessons/LessonGallery';
import { LessonHeader } from '@/components/features/lessons/LessonHeader';
import { LessonReservationSidebar } from '@/components/features/lessons/LessonReservationSidebar';
import { LessonTabContent } from '@/components/features/lessons/LessonTabContent';
import LoginRequiredDialog from '@/components/features/login/LoginRequiredDialog';
import ConfirmDialog from '@/components/features/modal/ConfirmDialog';
import { useLessonApplicationConfirmation } from '@/hooks/useLessonApplicationConfirmation';
import { useLessonLikeMutation } from '@/hooks/useLessonLikeMutation';
import { useLessonQuery } from '@/hooks/useLessonQuery';
import { useLessonReviewsQuery } from '@/hooks/useLessonReviewsQuery';
import { useLessonTabs } from '@/hooks/useLessonTabs';
import { useAuthStore } from '@/store/authStore';
import { formatFullDateTime } from '@/utils/dateFormat';
import { scrollToTop } from '@/utils/setScrollTo';

export interface LessonDetailProps {
	lessonId: string;
	navigate: (path: string, options?: { state?: unknown }) => void;
	onBack?: () => void;
	LoginRequiredDialogComponent: React.ComponentType<{
		open: boolean;
		onOpenChange: (open: boolean) => void;
	}>;
	useApplicationConfirmationHook: typeof useLessonApplicationConfirmation;
}

export const LessonDetailContent = ({
	lessonId,
	navigate,
	onBack: _onBack,
	LoginRequiredDialogComponent,
	useApplicationConfirmationHook,
}: LessonDetailProps) => {
	useLayoutEffect(() => {
		scrollToTop();
	}, []);

	const { data: lessonDetail, isLoading, error } = useLessonQuery(Number(lessonId));

	const {
		data: reviewsData,
		isLoading: isReviewsLoading,
		error: reviewsError,
	} = useLessonReviewsQuery(Number(lessonId));

	const { activeTab, tabTitles, handleTabClick, handleSectionRef } = useLessonTabs(lessonDetail);

	const [showLoginPrompt, setShowLoginPrompt] = useState(false);

	const { isLoggedIn, userId } = useAuthStore();

	const {
		showConfirmApply,
		setShowConfirmApply,
		selectedScheduleForDisplay,
		tempHeadcount,
		onApplyLessonFromSidebar,
		confirmApplyAction,
	} = useApplicationConfirmationHook({
		isLoggedIn,
		setShowLoginPrompt,
		lessonDetail,
	});

	const likeMutation = useLessonLikeMutation();
	const [optimisticLikeState, setOptimisticLikeState] = useState<{
		isLiked: boolean;
		likeCount: number;
	} | null>(null);

	useEffect(() => {
		if (!lessonDetail) return;
		setOptimisticLikeState(null);
	}, [lessonDetail]);

	const displayedIsLiked = optimisticLikeState?.isLiked ?? lessonDetail?.isLiked ?? false;
	const displayedLikeCount = optimisticLikeState?.likeCount ?? lessonDetail?.likeCount ?? 0;
	const isOwnedByCurrentUser = !!lessonDetail && userId === lessonDetail.userId;

	const handleWishlistToggle = () => {
		if (!isLoggedIn) {
			setShowLoginPrompt(true);
			return;
		}
		if (!lessonDetail) return;

		const prevIsLiked = displayedIsLiked;
		const prevLikeCount = displayedLikeCount;
		const nextIsLiked = !prevIsLiked;
		const nextLikeCount = nextIsLiked ? prevLikeCount + 1 : Math.max(0, prevLikeCount - 1);

		setOptimisticLikeState({
			isLiked: nextIsLiked,
			likeCount: nextLikeCount,
		});

		likeMutation.mutate(
			{
				lessonId: lessonDetail.id,
				newIsLiked: nextIsLiked,
			},
			{
				onError: () => {
					setOptimisticLikeState({
						isLiked: prevIsLiked,
						likeCount: prevLikeCount,
					});
				},
			},
		);
	};

	const handleInquiry = async () => {
		if (!isLoggedIn) {
			setShowLoginPrompt(true);
			return;
		}
		if (!lessonDetail) return;

		try {
			const room = await joinChatRoom({ lessonId: lessonDetail.id });
			navigate('/chats', {
				state: {
					chatType: 'lesson',
					roomId: room.roomId,
					lessonId: lessonDetail.id,
				},
			});
		} catch (err) {
			console.error('클래스 문의 채팅방 생성 실패:', err);
			toast.error('문의 채팅방을 열지 못했습니다. 잠시 후 다시 시도해 주세요.');
		}
	};

	if (isLoading || isReviewsLoading) {
		return <LoadingSpinner />;
	}

	if (error || reviewsError || !lessonDetail) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-lg text-destructive">
					{error
						? (error as Error).message
						: (reviewsError as Error)?.message || '클래스를 찾을 수 없습니다.'}
				</div>
			</div>
		);
	}

	return (
		<article className="flex flex-col min-h-screen bg-background pt-12">
			<div className="flex-1 w-full max-w-7xl mx-auto pb-8 px-4 md:px-6 lg:px-8">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
					{/* 왼쪽 메인 컨테이너 */}
					<section className="md:col-span-2 space-y-8" aria-label="클래스 상세 정보">
						<LessonGallery title={lessonDetail.title} images={lessonDetail.images} />
						<LessonHeader
							title={lessonDetail.title}
							classCategoryName={lessonDetail.lessonCategoryName}
							subCategories={lessonDetail.subCategories}
							likeCount={displayedLikeCount}
							rate={lessonDetail.rate}
							durationMin={lessonDetail.durationMin}
							address={lessonDetail.address}
							level={lessonDetail.level}
							maxParticipants={lessonDetail.maxParticipants}
							isLiked={displayedIsLiked}
						/>

						{/* 탭 네비게이션 및 클래스 정보 섹션 */}
						<LessonTabContent
							activeTab={activeTab}
							tabTitles={tabTitles}
							handleTabClick={handleTabClick}
							onSectionRef={handleSectionRef}
							description={lessonDetail.description}
							curriculum={lessonDetail.curriculum}
							teacher={lessonDetail.teacher}
							latitude={lessonDetail.latitude}
							longitude={lessonDetail.longitude}
							address={lessonDetail.address}
							detailAddress={lessonDetail.detailAddress}
							directionsText={lessonDetail.directionsText}
							navigate={navigate as ReturnType<typeof useNavigate>}
							reviewAiSummary={lessonDetail.reviewAiSummary}
							reviews={reviewsData?.data ?? []}
						/>
					</section>

					{/* 결제 섹션 */}
					<aside aria-label="클래스 예약 정보">
						<LessonReservationSidebar
							reservationLeadDays={lessonDetail.reservationLeadDays}
							price={lessonDetail.price}
							discountRate={lessonDetail.discountRate}
							discountedPrice={lessonDetail.discountedPrice}
							isLoggedIn={isLoggedIn}
							today={new Date()}
							threeMonthsLater={(() => {
								const d = new Date();
								d.setMonth(d.getMonth() + 3);
								return d;
							})()}
							schedules={lessonDetail.schedules}
							maxParticipants={lessonDetail.maxParticipants}
							onWishlistToggle={handleWishlistToggle}
							onInquiry={handleInquiry}
							onApplyLesson={onApplyLessonFromSidebar}
							showLoginPrompt={setShowLoginPrompt}
							isLiked={displayedIsLiked}
							isOwnedByCurrentUser={isOwnedByCurrentUser}
						/>
					</aside>
				</div>
			</div>

			<LoginRequiredDialogComponent
				open={showLoginPrompt}
				onOpenChange={setShowLoginPrompt}
			/>
			<ConfirmDialog
				open={showConfirmApply}
				onOpenChange={setShowConfirmApply}
				title="클래스 신청 확인"
				description={`선택하신 시간(${selectedScheduleForDisplay ? formatFullDateTime(selectedScheduleForDisplay.startAt) : '시간 미선택'})에 ${tempHeadcount}명으로 클래스를 신청하시겠습니까?`}
				confirmText="신청하기"
				cancelText="취소"
				onConfirm={confirmApplyAction}
			/>
		</article>
	);
};

export const LessonDetail = () => {
	const { lessonId } = useParams<{ lessonId: string }>();
	const navigate = useNavigate();

	return (
		<LessonDetailContent
			lessonId={lessonId!}
			navigate={navigate}
			onBack={() => navigate(-1)}
			LoginRequiredDialogComponent={LoginRequiredDialog}
			useApplicationConfirmationHook={useLessonApplicationConfirmation}
		/>
	);
};

export default LessonDetail;
