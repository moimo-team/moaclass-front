import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users } from "lucide-react";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import moimoMeeting from "@/assets/images/moimo-meetings.png";
import { useAuthStore } from "@/store/authStore";
import LoginRequiredDialog from "@/components/features/login/LoginRequiredDialog";
import KakaoMapView from "@/components/features/meetings/kakaoMaps/KakaoMapView";
import { toast } from "sonner";
import CreateMeetingModal from "@/components/features/meetings/CreateMeetingModal";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { useJoinMeetingMutation } from "@/hooks/useMeetingMutations";
import { useMeetingQuery } from "@/hooks/useMeetingQuery";
import { useMeQuery } from "@/hooks/useMeQuery";
import MeetingActionButtons from "@/components/features/meetings/MeetingActionButtons";
import { formatMeetingDate } from "@/utils/dateFormat";
import { useNavigate } from "react-router-dom";
import { useDeleteMeetingDialog } from "@/hooks/useDeleteMeetingDialog";
import { useInterestQuery } from "@/hooks/useInterestQuery";
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { MeetingParticipantsCard } from "@/components/features/meetings/MeetingParticipantsCard";
import { isMeetingClosed } from "@/utils/meetingUtils";
import { cn } from "@/lib/utils";
import { useParticipationsQuery } from "@/hooks/useParticipationsQuery";

function MeetingDetailPage() {
  const { meetingId } = useParams<{ meetingId: string }>();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: meetingDetail, isLoading, error } = useMeetingQuery(Number(meetingId));
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showExpandButton, setShowExpandButton] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);

  // 로그인 상태 및 모달 관리
  const { isLoggedIn, nickname } = useAuthStore();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showJoinConfirm, setShowJoinConfirm] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // 모임 신청 mutation
  const joinMeetingMutation = useJoinMeetingMutation();
  const navigate = useNavigate();

  // 모임 삭제
  const { handleDeleteMeeting, DeleteConfirmDialog } = useDeleteMeetingDialog({
    onSuccess: () => navigate("/mypage/meetings/hosting")
  });

  // 내가 신청한/참가한 모임 목록 조회
  const { meetings: pendingMeetings, isLoading: isPendingLoading } = useMeQuery("joined", "pending", 1, 50, { enabled: isLoggedIn });
  const { meetings: joinedMeetings, isLoading: isJoinedLoading } = useMeQuery("joined", "accepted", 1, 50, { enabled: isLoggedIn });

  // 카테고리 목록 조회 (이름 매핑용)
  const { data: interests } = useInterestQuery();

  // 내 모임인지 확인
  const isHost = meetingDetail?.host.nickname === nickname;

  // 마감 여부 확인
  const isClosed = meetingDetail
    ? isMeetingClosed(meetingDetail.currentParticipants, meetingDetail.maxParticipants, meetingDetail.meetingDate)
    : false;

  useEffect(() => {
    if (meetingId && pendingMeetings) {
      const isAlreadyApplied = pendingMeetings.some(
        (meeting) => meeting.meetingId === Number(meetingId)
      );
      setIsPending(isAlreadyApplied);
    }
  }, [meetingId, pendingMeetings]);

  // 신청자 알림 토스트
  const { data: participations } = useParticipationsQuery(Number(meetingId));
  const hasNotifiedRef = useRef(false);

  useEffect(() => {
    if (isHost && participations?.some(p => p.status === 'PENDING') && !hasNotifiedRef.current) {
      toast.info("새로운 모이미가 승인 요청 중입니다!");
      hasNotifiedRef.current = true;
    }
  }, [isHost, participations]);


  // 설명 텍스트 높이 확인
  useEffect(() => {
    if (descriptionRef.current && meetingDetail) {
      const height = descriptionRef.current.scrollHeight;
      setShowExpandButton(height > 192); // 192px = max-h-48
    }
  }, [meetingDetail]);

  const handleJoinMeeting = () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }

    // 신청 확인 모달 표시
    setShowJoinConfirm(true);
  };

  const handleConfirmJoin = async () => {
    if (!meetingId) return;
    try {
      await joinMeetingMutation.mutateAsync(Number(meetingId));
      setIsPending(true);
      toast.success("모임 신청이 완료되었습니다. 모이머의 승인을 기다려주세요!");
      setShowJoinConfirm(false);
    } catch (error: any) {
      console.error("모임 신청 에러:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error;

      if (error.response?.status === 400) {
        toast.error(errorMessage || "모임 신청에 실패했습니다");
      } else if (error.response?.status === 409) {
        toast.warning("이미 신청한 모임입니다");
        setIsPending(true);
      } else if (error.response?.status === 410) {
        toast.error("삭제된 모임입니다");
      } else {
        toast.error("모임 신청 중 오류가 발생했습니다");
      }
      setShowJoinConfirm(false);
    }
  };
  // 내 참여 정보 로딩 대기 (로그인 상태일 때만)
  const isMeInfoLoading = isLoggedIn && (isPendingLoading || isJoinedLoading);

  if (isLoading || isMeInfoLoading) {
    return (
      <LoadingSpinner />
    );
  }

  if (error || !meetingDetail) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-destructive">
          {error ? (error as Error).message : "모임을 찾을 수 없습니다."}
        </div>
      </div>
    );
  }


  return (
    <div className="flex flex-col min-h-screen bg-background pt-12">



      <div className="flex-1 w-full max-w-5xl mx-auto pb-8 space-y-8 px-4 md:px-0">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* 이미지 */}
          <div className="relative w-full md:w-1/2 aspect-square rounded-2xl overflow-hidden bg-muted flex-shrink-0 shadow-sm border border-border/50">
            {isClosed && (
              <div className="absolute inset-0 z-10 bg-black/40 flex items-center justify-center">
                <span className="bg-black/60 text-white px-3 py-1.5 rounded-full text-sm font-bold border border-white/20">
                  마감됨
                </span>
              </div>
            )}
            {meetingDetail.meetingImage ? (
              <img
                src={meetingDetail.meetingImage}
                alt={meetingDetail.title}
                className={cn(
                  "w-full h-full object-cover",
                  isClosed && "grayscale-[0.5]"
                )}
              />
            ) : (
              <img
                src={moimoMeeting}
                alt={meetingDetail.title}
                className={cn(
                  "w-full h-full object-cover",
                  isClosed && "grayscale-[0.5]"
                )}
              />
            )}
          </div>

          {/* 정보 */}
          <div className="flex-1 flex flex-col h-full min-h-[500px] justify-between py-2">
            <div>
              <div className="flex items-start justify-between pb-8">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-base px-3 py-1.5 font-medium border-primary/20">
                    {(meetingDetail.interestName || interests?.find(i => i.id === meetingDetail.interestId)?.name) || "카테고리 없음"}
                  </Badge>
                </div>
                {/* 수정/삭제 버튼 - 호스트일 때만 표시 */}
                {isHost && (
                  <div className="ml-auto">
                    <MeetingActionButtons
                      meetingId={Number(meetingId)}
                      role="host"
                      location="detail-top"
                      onEdit={() => setShowEditModal(true)}
                      onDelete={() => handleDeleteMeeting(Number(meetingId))}
                    />
                  </div>
                )}
              </div>

              <h1 className="text-3xl font-bold text-foreground mb-6">
                {meetingDetail.title}
              </h1>

              <div className="space-y-4">
                <div className="flex items-start gap-3 text-lg text-foreground/80">
                  <MapPin className="w-5 h-5 mt-1 text-primary shrink-0" />
                  <span>{meetingDetail.location.address}</span>
                </div>

                <div className="flex items-center gap-3 text-lg text-foreground/80">
                  <Calendar className="w-5 h-5 text-primary shrink-0" />
                  <span>{formatMeetingDate(meetingDetail.meetingDate)}</span>
                </div>

                {meetingDetail.maxParticipants && (
                  <div className="flex items-center gap-3 text-lg text-foreground/80">
                    <Users className="w-5 h-5 text-primary shrink-0" />
                    <span>{meetingDetail.currentParticipants || 1}명 / {meetingDetail.maxParticipants}명</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border/50">
              <MeetingActionButtons
                meetingId={Number(meetingId)}
                role={isHost ? "host" : "participant"}
                location="detail-mid"
                isPending={isPending}
                isJoined={joinedMeetings?.some((m) => m.meetingId === Number(meetingId))}
                isLoggedIn={isLoggedIn}
                isClosed={isClosed}
                onJoin={handleJoinMeeting}
                onChat={() => navigate("/chats", { state: { meetingId: Number(meetingId) } })}
              />
            </div>
          </div>
        </div>
        {/* 설명 */}
        <Card className="border-2 border-border/50 shadow-sm overflow-hidden rounded-xl">
          <CardHeader className="bg-primary/5 pb-4 border-b border-border/50">
            <CardTitle className="text-xl font-bold">우리 모임은요...</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div
              ref={descriptionRef}
              className={`text-base text-foreground whitespace-pre-wrap leading-relaxed transition-all duration-300 ${isDescriptionExpanded ? "" : "max-h-48 overflow-hidden"
                }`}
            >
              {meetingDetail.description}
            </div>
            {showExpandButton && (
              <button
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="mt-4 text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
              >
                {isDescriptionExpanded ? '접기' : '더보기'}
              </button>
            )}
          </CardContent>
        </Card>

        {/* 참여자 */}
        <MeetingParticipantsCard
          meetingId={Number(meetingId)}
          host={meetingDetail.host}
          currentParticipants={meetingDetail.currentParticipants || 1}
          maxParticipants={meetingDetail.maxParticipants}
        />

        {/* 지도 */}
        <Card className="border-2 border-border/50 shadow-sm overflow-hidden rounded-xl">
          <CardHeader className="bg-primary/5 pb-4 border-b border-border/50">
            <CardTitle className="text-xl font-bold">여기에서 만나요!</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="w-full h-96 bg-muted">
              <KakaoMapView
                lat={meetingDetail.location.lat}
                lng={meetingDetail.location.lng}
                placeName={meetingDetail.location.address}
                level={3}
              />
            </div>
            <div className="p-4 bg-card border-t border-border/50">
              <p className="text-base font-medium text-foreground flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                {meetingDetail.location.address}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <MeetingActionButtons
        meetingId={Number(meetingId)}
        role={isHost ? "host" : "participant"}
        location="detail-bottom"
        isPending={isPending}
        isJoined={joinedMeetings?.some((m) => m.meetingId === Number(meetingId))}
        isLoggedIn={isLoggedIn}
        isClosed={isClosed}
        onJoin={handleJoinMeeting}
        onChat={() => navigate("/chats", { state: { meetingId: Number(meetingId) } })}
      />
      <DeleteConfirmDialog />


      <LoginRequiredDialog
        open={showLoginPrompt}
        onOpenChange={setShowLoginPrompt}
      />

      {/* 수정 모달 */}
      {showEditModal && meetingDetail && (
        <CreateMeetingModal
          open={showEditModal}
          onOpenChange={setShowEditModal}
          meeting={meetingDetail}
        />
      )}

      {/* 신청 확인 모달 */}
      <ConfirmDialog
        open={showJoinConfirm}
        onOpenChange={setShowJoinConfirm}
        title="모임 신청"
        description={`해당 모임을 신청하시겠습니까?\n 신청 후 취소가 불가능합니다.`}
        confirmText="신청하기"
        cancelText="취소"
        onConfirm={handleConfirmJoin}
      />

      {/* 삭제 확인 모달 */}

    </div>
  );
}

export default MeetingDetailPage;
