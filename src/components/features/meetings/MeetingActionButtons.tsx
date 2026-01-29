import { Button } from "@/components/ui/button";
import { Pencil, Trash2, MessageCircle, X, RotateCcw, UserCheck, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FixedBottomButton from "@/components/common/FixedBottomButton";

interface MeetingActionButtonsProps {
  meetingId: number;
  role: "host" | "participant" | "applicant";
  location?: "detail-mid" | "detail-bottom" | "detail-top" | "hosting-list" | "joined-list";

  // 호스트 전용
  onEdit?: () => void;
  onDelete?: () => void;

  // 참가자 전용
  isPending?: boolean;
  isJoined?: boolean;
  isLoggedIn?: boolean;
  onJoin?: () => void;
  onChat?: () => void;

  // 신청자 관리 전용 (호스트가 신청자를 관리할 때)
  applicantStatus?: "PENDING" | "ACCEPTED" | "REJECTED";
  onApprove?: () => void;
  onReject?: () => void;
  onCancelApproval?: () => void;
  onCancelReject?: () => void;
  isLoading?: boolean;
  isClosed?: boolean;
}

function MeetingActionButtons({
  meetingId,
  role,
  location = "hosting-list",
  onEdit,
  onDelete,
  isPending = false,
  isJoined = false,
  isLoggedIn = false,
  onJoin,
  onChat,
  applicantStatus,
  onApprove,
  onReject,
  onCancelApproval,
  onCancelReject,
  isLoading = false,
  isClosed = false,
}: MeetingActionButtonsProps) {
  const navigate = useNavigate();

  const handleManageClick = () => {
    navigate(`/mypage/meetings/hosting/${meetingId}/participations`);
  };

  const handleChatClick = () => {
    navigate("/chats", { state: { meetingId } });
  };

  // Host
  if (role === "host") {
    // 상단 인라인 버튼 (승인 요청 목록 + 채팅)
    if (location === "detail-mid") {
      return (
        <div className="flex gap-2">
          <Button
            onClick={handleManageClick}
            className="flex-[3] h-16 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-colors text-base font-semibold gap-3"
          >
            <Users className="w-5 h-5" fill="currentColor" />
            승인 요청 목록 보기
          </Button>
          <Button
            onClick={handleChatClick}
            variant="outline"
            className="flex-[2] h-16 py-2.5 rounded-md transition-colors text-base font-semibold gap-2 border-[1.5px]"
          >
            <MessageCircle className="w-5 h-5 text-yellow-500" fill="currentColor" />
            채팅
          </Button>
        </div>
      );
    }

    // 하단 고정 버튼 (승인 요청 목록만)
    if (location === "detail-bottom") {
      return (
        <FixedBottomButton onClick={handleManageClick}>
          승인 요청 목록 보기
        </FixedBottomButton>
      );
    }

    // 헤더 버튼 (수정 + 삭제)
    if (location === "detail-top") {
      return (
        <div className="flex gap-2">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="gap-2 border-[1.5px] border-yellow-400 font-semibold"
            >
              <Pencil className="h-4 w-4 text-yellow-500" fill="currentColor" />
              수정
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="gap-2 border-[1.5px] border-red-500 text-red-600 hover:bg-red-50 font-semibold"
            >
              <Trash2 className="h-4 w-4" />
              삭제
            </Button>
          )}
        </div>
      );
    }

    // 카드 내부: 관리 + 수정 + 삭제 + 채팅
    return (
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handleManageClick}
          className="h-10 border-[1.5px] border-yellow-400 text-gray-900 shadow-none font-semibold gap-2 hover:bg-yellow-50"
        >
          <Users className="w-4 h-4 text-yellow-500" fill="currentColor" />
          모이미 관리
        </Button>

        {onEdit && (
          <Button
            variant="outline"
            onClick={onEdit}
            className="h-10 border-[1.5px] border-yellow-400 text-gray-900 hover:bg-yellow-50 shadow-none font-semibold"
          >
            <Pencil className="w-4 h-4 text-yellow-500 " fill="currentColor" />
            수정
          </Button>
        )}



        <Button
          variant="outline"
          onClick={handleChatClick}
          className="h-10 border-[1.5px] border-yellow-400 text-gray-900 shadow-none gap-2 font-semibold"
        >
          <MessageCircle className="w-4 h-4 text-yellow-500" fill="currentColor" />
          채팅
        </Button>
        {onDelete && (
          <Button
            variant="outline"
            onClick={onDelete}
            className="h-10 border-[1.5px] border-red-500 text-red-600 hover:bg-red-50 shadow-none font-semibold"
          >
            <Trash2 className="w-4 h-4" />
            삭제
          </Button>
        )}
      </div>
    );
  }

  // 내 모임 관리 (거절, 승인, 승인취소, 거절취소)
  if (role === "applicant") {
    return (
      <div className="flex gap-2">
        {applicantStatus === "PENDING" && (
          <>
            <Button
              variant="outline"
              className="h-10 border-2 border-[#FF8A8A] text-[#FF8A8A] font-bold hover:bg-[#FF8A8A]/10 shadow-none gap-2"
              onClick={onReject}
              disabled={isLoading}
            >
              <X className="w-4 h-4" fill="currentColor" />
              거절
            </Button>
            <Button
              variant="outline"
              className="h-10 border-2 border-[#FFB800] text-[#FFB800] hover:bg-[#FFB800]/10 shadow-none gap-2 font-bold"
              onClick={onApprove}
              disabled={isLoading}
            >
              <UserCheck className="w-4 h-4" fill="currentColor" />
              승인
            </Button>
          </>
        )}
        {applicantStatus === "ACCEPTED" && (
          <Button
            variant="outline"
            className="h-10 border-2 border-gray-400 text-gray-500 hover:bg-gray-50 shadow-none gap-2 font-bold"
            onClick={onCancelApproval}
            disabled={isLoading}
          >
            <RotateCcw className="w-4 h-4" />
            승인취소
          </Button>
        )}
        {applicantStatus === "REJECTED" && (
          <Button
            variant="outline"
            className="h-10 border-2 border-blue-400 text-blue-500 hover:bg-blue-50 shadow-none gap-2 font-semibold"
            onClick={onCancelReject}
            disabled={isLoading}
          >
            <RotateCcw className="w-4 h-4" />
            거절취소
          </Button>
        )}
      </div>
    );
  }

  // Participant
  if (role === "participant") {
    // 가입 완료 상태
    if (isJoined) {
      if (location === "detail-mid") {
        return (
          <Button
            onClick={onChat || handleChatClick}
            className="w-full h-16 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-gray font-semibold rounded-md transition-colors text-base"
          >
            채팅방으로 이동
          </Button>
        );
      }
      if (location === "detail-bottom") {
        return (
          <FixedBottomButton
            onClick={onChat || handleChatClick}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray font-semibold"
          >
            채팅방으로 이동
          </FixedBottomButton>
        );
      }
    }

    const buttonText = isJoined
      ? "채팅방으로 이동"
      : isPending
        ? "승인 요청 중"
        : isClosed
          ? "마감된 모임입니다."
          : isLoggedIn
            ? "이 모임 신청하기"
            : "로그인하고 신청하기";

    const isDisabled = isPending || (isClosed && !isJoined);

    // 상단 인라인 신청하기 버튼
    if (location === "detail-mid") {
      return (
        <Button
          onClick={onJoin}
          disabled={isDisabled}
          className="w-full h-16 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-colors text-base font-semibold disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
        >
          {buttonText}
        </Button>
      );
    }

    // 하단 고정 버튼
    if (location === "detail-bottom") {
      return (
        <FixedBottomButton onClick={onJoin} disabled={isDisabled}>
          {buttonText}
        </FixedBottomButton>
      );
    }

    // 목록 카드 내부 (Joined List)
    if (location === "joined-list") {
      // 승인 대기 상태
      if (isPending) {
        return (
          <Button
            disabled
            variant="outline"
            className="h-10 border-[1.5px] border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed shadow-none font-semibold"
          >
            승인 대기중
          </Button>
        );
      }

      // 참여 완료 (채팅 가능)
      if (isJoined) {
        return (
          <Button
            variant="outline"
            onClick={onChat || handleChatClick}
            className="h-10 border-[1.5px] border-yellow-400 text-gray-900 shadow-none gap-2 font-semibold"
          >
            <MessageCircle className="w-4 h-4 text-yellow-500" fill="currentColor" />
            채팅
          </Button>
        );
      }
    }
  }

  return null;
}

export default MeetingActionButtons;
