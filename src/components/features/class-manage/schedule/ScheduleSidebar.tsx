import { useState, useMemo, useEffect } from "react";
import { Clock, CheckCircle2, Calendar as CalendarIcon, Trash2, CalendarRange } from "lucide-react";

import { useDeleteSchedulesMutation } from "@/hooks/useScheduleMutations";
import { extractTimeFromISO } from "@/utils/scheduleHelpers";
import { formatScheduleFullDate, toYYYYMMDD } from "@/utils/dateFormat";
import type { LessonSchedule } from "@/models/schedule.model";

import ConfirmDialog from "@/components/features/modal/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { ScheduleParticipantModal } from "./ScheduleParticipantModal";

interface ScheduleSidebarProps {
  lessonId: number;
  selectedDates: Date[];
  schedulesByDate: Record<string, LessonSchedule[]>;
}

export const ScheduleSidebar = ({
  lessonId,
  selectedDates,
  schedulesByDate,
}: ScheduleSidebarProps) => {
  const { mutate: deleteSchedules } = useDeleteSchedulesMutation(lessonId);
  const [selectedScheduleIds, setSelectedScheduleIds] = useState<number[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [participantModalInfo, setParticipantModalInfo] = useState<{
    scheduleId: number;
    dateStr: string;
    timeStr: string;
  } | null>(null);

  // 선택된 날짜가 바뀌면 선택 상태 초기화
  useEffect(() => {
    setSelectedScheduleIds([]);
  }, [selectedDates]);

  const dateKeys = selectedDates.map((d) => toYYYYMMDD(d.toISOString()));

  const allSelectedSchedules = useMemo(() => {
    return dateKeys
      .flatMap((key) => schedulesByDate[key] || [])
      .sort((a, b) => a.startAt.localeCompare(b.startAt));
  }, [dateKeys, schedulesByDate]);

  const withParticipants = allSelectedSchedules.filter(s => s.currentParticipants > 0);
  const withoutParticipants = allSelectedSchedules.filter(s => s.currentParticipants === 0);

  const toggleScheduleSelection = (id: number) => {
    setSelectedScheduleIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllWithoutParticipants = () => {
    const isAllSelected = withoutParticipants.length > 0 &&
      withoutParticipants.every(s => selectedScheduleIds.includes(s.id));

    if (isAllSelected) {
      setSelectedScheduleIds([]);
    } else {
      setSelectedScheduleIds(withoutParticipants.map(s => s.id));
    }
  };

  const handleDeleteClick = () => {
    if (selectedScheduleIds.length === 0) return;
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteSchedules(selectedScheduleIds, {
      onSuccess: () => {
        setSelectedScheduleIds([]);
        setIsDeleteDialogOpen(false);
      }
    });
  };

  const handleViewParticipants = (schedule: LessonSchedule) => {
    setParticipantModalInfo({
      scheduleId: schedule.id,
      dateStr: formatScheduleFullDate(schedule.startAt),
      timeStr: `${extractTimeFromISO(schedule.startAt)} - ${extractTimeFromISO(schedule.endAt)}`
    });
  };

  if (selectedDates.length === 0) {
    return (
      <div className="bg-gray-50/50 rounded-2xl p-8 text-center border-2 border-dashed border-gray-100 h-[600px] flex flex-col items-center justify-center">
        <div className="bg-white w-14 h-14 rounded-full flex items-center justify-center mb-5 shadow-sm border border-gray-100">
          <CalendarRange className="w-7 h-7 text-gray-200" />
        </div>
        <div className="space-y-1">
          <p className="text-gray-500 text-sm font-extrabold">선택된 날짜 없음</p>
          <p className="text-gray-400 text-xs font-medium leading-relaxed">
            캘린더에서 날짜를 클릭하여<br />일정을 관리해 보세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-[800px]">
      <div className="pb-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <CalendarIcon className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">상세 일정 관리</h2>
          </div>
          <Badge className="bg-primary/10 text-primary border-none hover:bg-primary/20 px-3 py-1 font-black shadow-sm shrink-0">
            총 {allSelectedSchedules.length}건
          </Badge>
        </div>
      </div>

      {allSelectedSchedules.length === 0 ? (
        <div className="py-20 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-100">
          <p className="text-gray-400 text-xs font-bold">등록된 상세 일정이 없습니다.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto scrollbar-hide space-y-8 pr-0.5">

          {/* 섹션 1: 모멘티 O */}
          {withParticipants.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <div className="w-1.5 h-1.5 rounded-full bg-carrot" />
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">모멘티 O</h4>
              </div>
              <div className="grid gap-2.5">
                {withParticipants.map((schedule) => (
                  <ScheduleCard
                    key={schedule.id}
                    schedule={schedule}
                    isWithParticipants
                    onViewParticipants={() => handleViewParticipants(schedule)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 섹션 2: 모멘티 X */}
          {withoutParticipants.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">모멘티 X</h4>
                </div>
                <div className="flex items-center gap-1.5">
                  {selectedScheduleIds.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDeleteClick}
                      className="h-7 text-red-500 hover:text-red-700 hover:bg-red-50 text-[11px] font-black px-2 rounded-lg transition-all animate-in slide-in-from-right-2"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" />
                      삭제({selectedScheduleIds.length})
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSelectAllWithoutParticipants}
                    className="h-7 text-[11px] font-black text-gray-500 hover:bg-gray-100 px-2 rounded-lg"
                  >
                    {withoutParticipants.every(s => selectedScheduleIds.includes(s.id)) ? "해제" : "전체"}
                  </Button>
                </div>
              </div>

              <div className="grid gap-2.5">
                {withoutParticipants.map((schedule) => (
                  <ScheduleCard
                    key={schedule.id}
                    schedule={schedule}
                    isSelected={selectedScheduleIds.includes(schedule.id)}
                    onClick={() => toggleScheduleSelection(schedule.id)}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="h-4" />
        </div>
      )}

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="일정 삭제 확인"
        description={`선택한 ${selectedScheduleIds.length}개의 일정을 삭제하시겠습니까?\n삭제된 일정은 복구할 수 없습니다.`}
        confirmText="삭제하기"
        onConfirm={handleConfirmDelete}
        variant="destructive"
      />

      <ScheduleParticipantModal
        isOpen={!!participantModalInfo}
        onClose={() => setParticipantModalInfo(null)}
        scheduleId={participantModalInfo?.scheduleId ?? null}
        dateStr={participantModalInfo?.dateStr}
        timeStr={participantModalInfo?.timeStr}
      />
    </div>
  );
};

const ScheduleCard = ({
  schedule,
  isWithParticipants = false,
  isSelected = false,
  onClick,
  onViewParticipants
}: {
  schedule: LessonSchedule;
  isWithParticipants?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  onViewParticipants?: () => void;
}) => {
  return (
    <div
      onClick={!isWithParticipants ? onClick : undefined}
      className={`relative p-4 border rounded-xl transition-all duration-300 group ${isWithParticipants
        ? "bg-gray-50/30 border-gray-100 cursor-default"
        : isSelected
          ? "font-black bg-white border-primary shadow-md ring-4 ring-primary/5"
          : "bg-white border-gray-100 hover:border-gray-300 hover:shadow-sm"
        }`}
    >
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-1.5 text-[14px] font-black tracking-tight ${isSelected ? "text-primary" : "text-gray-800"}`}>
            {formatScheduleFullDate(schedule.startAt)}
          </div>
          {isSelected && (
            <div className="bg-primary text-white rounded-full p-0.5 shadow-sm animate-in zoom-in duration-300">
              <CheckCircle2 className="w-3 h-3" />
            </div>
          )}
          {isWithParticipants && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onViewParticipants?.();
              }}
              className="h-7 text-[10px] font-black border-carrot/30 text-carrot hover:bg-carrot hover:text-white transition-all rounded-lg"
            >
              모멘티 정보
            </Button>
          )}
        </div>

        <div className="flex items-center justify-between bg-gray-50/50 p-2 rounded-lg">
          <div className={`flex items-center gap-2 text-[13px] font-bold ${isSelected ? "text-gray-800" : "text-gray-500"}`}>
            <Clock className={`w-3.5 h-3.5 ${isWithParticipants ? "text-carrot/80" : isSelected ? "text-primary" : "text-primary/30"}`} />
            {extractTimeFromISO(schedule.startAt)} - {extractTimeFromISO(schedule.endAt)}
          </div>

          <div className={`text-[12px] font-black ${isWithParticipants ? "text-carrot" : isSelected ? "text-primary/80" : "text-primary/40"}`}>
            {schedule.currentParticipants} / {schedule.maxParticipants}명
          </div>
        </div>
      </div>
    </div>
  );
};
