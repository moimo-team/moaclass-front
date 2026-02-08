import { useState, useLayoutEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatClassCreateDate } from "@/utils/dateFormat";
import { useAuthStore } from "@/store/authStore";
import LoginRequiredDialog from "@/components/features/login/LoginRequiredDialog";
import ConfirmDialog from "@/components/features/modal/ConfirmDialog";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { toast } from "sonner";
import { useLessonQuery } from "@/hooks/useLessonQuery";
import { LessonGallery } from "@/components/features/lessons/LessonGallery";
import { LessonHeader } from "@/components/features/lessons/LessonHeader";
import { LessonTabContent } from "@/components/features/lessons/LessonTabContent";
import { LessonReservationSidebar } from "@/components/features/lessons/LessonReservationSidebar";
import { useLessonTabs } from "@/hooks/useLessonTabs";
import { useLessonApplicationConfirmation } from "@/hooks/useLessonApplicationConfirmation";
import { useLessonReviewsQuery } from "@/hooks/useLessonReviewsQuery";

export const LessonDetail = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    data: lessonDetail,
    isLoading,
    error,
  } = useLessonQuery(Number(lessonId));

  const {
    data: reviewsData,
    isLoading: isReviewsLoading,
    error: reviewsError,
  } = useLessonReviewsQuery(Number(lessonId));

  const { activeTab, tabTitles, handleTabClick, handleSectionRef } =
    useLessonTabs(lessonDetail);

  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const { isLoggedIn } = useAuthStore();

  const {
    showConfirmApply,
    setShowConfirmApply,
    tempSelectedDate,
    tempHeadcount,
    onApplyLessonFromSidebar,
    confirmApplyAction,
  } = useLessonApplicationConfirmation({
    isLoggedIn,
    setShowLoginPrompt,
  });

  const handleWishlistToggle = () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }
    toast.info("위시리스트 기능 (API 연동 필요)");
    // API Endpoint: POST /api/lessons/{lessonId}/wishlist
    // TODO: API 연동 필요 (위시리스트 기능)
  };

  const handleInquiry = () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }
    navigate("/chats");
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
            : (reviewsError as Error)?.message || "클래스를 찾을 수 없습니다."}
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
    likes,
    address,
    detailAddress,
    directionsText,
    rate,
    lessonImages,
    teacherProfile,
    latitude,
    longitude,
    reservationLeadDays,
  } = lessonDetail;

  return (
    <div className="flex flex-col min-h-screen bg-background pt-12">
      <div className="flex-1 w-full max-w-7xl mx-auto pb-8 px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* 왼쪽 메인 컨테이너 */}
          <div className="md:col-span-2 space-y-8">
            <LessonGallery
              key={
                lessonImages
                  ? lessonImages.map((img) => img.id).join("-")
                  : "no-images"
              }
              title={title}
              lessonImages={lessonImages}
            />
            <LessonHeader
              title={title}
              classCategoryName={lessonDetail.classCategory?.name}
              subClassCategories={lessonDetail.subClassCategories}
              likes={likes}
              rate={rate}
              durationMin={durationMin}
              address={address}
              level={level}
              maxParticipants={maxParticipants}
            />

            {/* 탭 네비게이션 및 클래스 정보 섹션 */}
            <LessonTabContent
              activeTab={activeTab}
              tabTitles={tabTitles}
              handleTabClick={handleTabClick}
              onSectionRef={handleSectionRef}
              description={description}
              curriculum={curriculum}
              teacherProfile={teacherProfile}
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
            onWishlistToggle={handleWishlistToggle}
            onInquiry={handleInquiry}
            onApplyLesson={onApplyLessonFromSidebar}
            showLoginPrompt={setShowLoginPrompt}
          />
        </div>
      </div>

      <LoginRequiredDialog
        open={showLoginPrompt}
        onOpenChange={setShowLoginPrompt}
      />
      <ConfirmDialog
        open={showConfirmApply}
        onOpenChange={setShowConfirmApply}
        title="클래스 신청 확인"
        description={`선택하신 날짜(${tempSelectedDate ? formatClassCreateDate(tempSelectedDate) : "날짜 미선택"})에 ${tempHeadcount}명으로 클래스를 신청하시겠습니까?`}
        confirmText="신청하기"
        cancelText="취소"
        onConfirm={confirmApplyAction}
      />
    </div>
  );
};

export default LessonDetail;
