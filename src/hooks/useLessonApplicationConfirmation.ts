import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import type { LessonDetail } from "@/models/lesson.model";

interface UseLessonApplicationConfirmationProps {
  isLoggedIn: boolean;
  setShowLoginPrompt: (show: boolean) => void;
  lessonDetail: LessonDetail | undefined;
}

export const useLessonApplicationConfirmation = ({
  isLoggedIn,
  setShowLoginPrompt,
  lessonDetail,
}: UseLessonApplicationConfirmationProps) => {
  const navigate = useNavigate();
  const [showConfirmApply, setShowConfirmApply] = useState(false);
  
  // ✨ tempSelectedDate를 tempScheduleId로 변경
  const [tempScheduleId, setTempScheduleId] = useState<number | null>(null);
  const [tempHeadcount, setTempHeadcount] = useState(1);

  // ✨ onApplyLessonFromSidebar 시그니처 변경
  const onApplyLessonFromSidebar = (
    scheduleId: number,
    headcount: number,
  ) => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }
    setTempScheduleId(scheduleId);
    setTempHeadcount(headcount);
    setShowConfirmApply(true);
  };

  const confirmApplyAction = () => {
    // ✨ scheduleId를 직접 사용하도록 로직 변경
    if (!tempScheduleId) {
      toast.error("선택된 클래스 시간 정보가 없습니다.");
      setShowConfirmApply(false);
      return;
    }

    const scheduleId = tempScheduleId;
    const quantity = tempHeadcount;
    
    navigate(`/payments/preview?scheduleId=${scheduleId}&quantity=${quantity}`);
    setShowConfirmApply(false);
    toast.success("클래스 신청 페이지로 이동합니다.");
  };
  
  // ✨ 모달에 표시할 날짜/시간 정보를 찾기 위한 로직
  const selectedScheduleForDisplay = lessonDetail?.schedules.find(s => s.id === tempScheduleId);

  return {
    showConfirmApply,
    setShowConfirmApply,
    selectedScheduleForDisplay, // ✨ 모달에서 사용할 수 있도록 반환
    tempHeadcount,
    onApplyLessonFromSidebar,
    confirmApplyAction,
  };
};
