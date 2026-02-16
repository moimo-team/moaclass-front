'use client';

import { useState, useLayoutEffect } from 'react';

import { useRouter } from 'next/navigation';

import { LessonClientTabContent } from '@/app/lessons/[lessonId]/_components/LessonClientTabContent';
import LoginRequiredClientDialog from '@/app/lessons/[lessonId]/_components/LoginRequiredClientDialog';
import { useLessonClientConfirmation } from '@/app/lessons/[lessonId]/_hooks/useLessonClientConfirmation';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { LessonGallery } from '@/components/features/lessons/LessonGallery';
import { LessonHeader } from '@/components/features/lessons/LessonHeader';
import { LessonReservationSidebar } from '@/components/features/lessons/LessonReservationSidebar';
import ConfirmDialog from '@/components/features/modal/ConfirmDialog';
import { useLessonLikeMutation } from '@/hooks/useLessonLikeMutation';
import { useLessonQuery } from '@/hooks/useLessonQuery';
import { useLessonReviewsQuery } from '@/hooks/useLessonReviewsQuery';
import { useLessonTabs } from '@/hooks/useLessonTabs';
import { useAuthStore } from '@/store/authStore';
import { formatFullDateTime } from '@/utils/dateFormat';

interface LessonClientProps {
	lessonId: string;
}

export default function LessonClient({ lessonId }: LessonClientProps) {
	const router = useRouter();
	// const params = useParams(); // [DELETE] remove useParams
	// const lessonId = params.lessonId as string; // [DELETE] use prop instead

	// navigate wrapper for compatibility
	const navigate = (path: string) => router.push(path);

	useLayoutEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const { data: lessonDetail, isLoading, error } = useLessonQuery(Number(lessonId));

	const {
		data: reviewsData,
		isLoading: isReviewsLoading,
		error: reviewsError,
	} = useLessonReviewsQuery(Number(lessonId));

	const { activeTab, tabTitles, handleTabClick, handleSectionRef } = useLessonTabs(lessonDetail);

	const [showLoginPrompt, setShowLoginPrompt] = useState(false);

	const { isLoggedIn } = useAuthStore();

	const {
		showConfirmApply,
		setShowConfirmApply,
		selectedScheduleForDisplay,
		tempHeadcount,
		onApplyLessonFromSidebar,
		confirmApplyAction,
	} = useLessonClientConfirmation({
		isLoggedIn,
		setShowLoginPrompt,
		lessonDetail,
	});

	const likeMutation = useLessonLikeMutation([['lesson', Number(lessonId)]]);

	const handleWishlistToggle = () => {
		if (!isLoggedIn) {
			setShowLoginPrompt(true);
			return;
		}
		if (!lessonDetail) return;

		likeMutation.mutate({
			lessonId: lessonDetail.id,
			newIsLiked: !lessonDetail.isLiked,
		});
	};

	const handleInquiry = () => {
		if (!isLoggedIn) {
			setShowLoginPrompt(true);
			return;
		}
		navigate('/chats');
		// API Endpoint: POST /api/lessons/{lessonId}/inquiry
		// TODO: API 연동 필요 (문의 기능)
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

	const {
		title,
		description,
		curriculum,
		level,
		durationMin,
		price,
		discountRate,
		discountedPrice,
		maxParticipants,
		likeCount,
		address,
		detailAddress,
		directionsText,
		rate,
		images,
		teacher,
		latitude,
		longitude,
		reservationLeadDays,
		lessonCategoryName,
		subCategories,
		schedules,
	} = lessonDetail;

	return (
		<div className="flex flex-col min-h-screen bg-background pt-12">
			<div className="flex-1 w-full max-w-7xl mx-auto pb-8 px-4 md:px-6 lg:px-8">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
					{/* 왼쪽 메인 컨테이너 */}
					<div className="md:col-span-2 space-y-8">
						<LessonGallery
							key={images ? images.map((img) => img.id).join('-') : 'no-images'}
							title={title}
							images={images}
						/>
						<LessonHeader
							title={title}
							classCategoryName={lessonCategoryName}
							subCategories={subCategories}
							likeCount={likeCount}
							rate={rate}
							durationMin={durationMin}
							address={address}
							level={level}
							maxParticipants={maxParticipants}
							isLiked={lessonDetail.isLiked}
						/>

						{/* 탭 네비게이션 및 클래스 정보 섹션 */}
						<LessonClientTabContent
							activeTab={activeTab}
							tabTitles={tabTitles}
							handleTabClick={handleTabClick}
							onSectionRef={handleSectionRef}
							description={description}
							curriculum={curriculum}
							teacher={teacher}
							latitude={latitude}
							longitude={longitude}
							address={address}
							detailAddress={detailAddress}
							directionsText={directionsText}
							navigate={navigate}
							reviews={reviewsData || []}
						/>
					</div>

					{/* 결제 섹션 */}
					<LessonReservationSidebar
						reservationLeadDays={reservationLeadDays}
						price={price}
						discountRate={discountRate}
						discountedPrice={discountedPrice}
						isLoggedIn={isLoggedIn}
						today={new Date()}
						threeMonthsLater={(() => {
							const d = new Date();
							d.setMonth(d.getMonth() + 3);
							return d;
						})()}
						schedules={schedules}
						maxParticipants={maxParticipants}
						onWishlistToggle={handleWishlistToggle}
						onInquiry={handleInquiry}
						onApplyLesson={onApplyLessonFromSidebar}
						showLoginPrompt={setShowLoginPrompt}
						isLiked={lessonDetail.isLiked}
					/>
				</div>
			</div>

			<LoginRequiredClientDialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt} />
			<ConfirmDialog
				open={showConfirmApply}
				onOpenChange={setShowConfirmApply}
				title="클래스 신청 확인"
				description={`선택하신 시간(${selectedScheduleForDisplay ? formatFullDateTime(selectedScheduleForDisplay.startAt) : '시간 미선택'})에 ${tempHeadcount}명으로 클래스를 신청하시겠습니까?`}
				confirmText="신청하기"
				cancelText="취소"
				onConfirm={confirmApplyAction}
			/>
		</div>
	);
}
