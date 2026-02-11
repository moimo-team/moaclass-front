import { Trash2, Clock } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { extractTimeFromISO, formatDisplayDate } from "@/utils/scheduleHelpers";
import type { LessonSchedule } from "@/models/schedule.model";
import { useDeleteScheduleMutation } from "@/hooks/useScheduleMutations";

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
  const { mutate: deleteSchedule } = useDeleteScheduleMutation(lessonId);

  const dateKeys = selectedDates.map((d) => format(d, "yyyy-MM-dd"));

  const selectedSchedules = dateKeys
    .flatMap((key) => schedulesByDate[key] || [])
    .sort((a, b) => a.startAt.localeCompare(b.startAt));

  if (selectedDates.length === 0) {
    return (
      <div className="bg-gray-50 rounded-2xl p-10 text-center border-2 border-dashed border-gray-200">
        <p className="text-gray-400 text-sm font-medium leading-relaxed">
          캘린더에서 날짜를 선택하여<br />일정을 확인하거나 등록하세요.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900">
          {selectedDates.length === 1
            ? formatDisplayDate(selectedDates[0])
            : `${selectedDates.length}개 날짜 선택됨`}
        </h3>
        <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-none px-3 py-1">
          총 {selectedSchedules.length}건
        </Badge>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {selectedSchedules.length > 0 ? (
          selectedSchedules.map((schedule) => (
            <div
              key={schedule.id}
              className="group p-4 bg-white border rounded-xl hover:border-primary/30 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    {extractTimeFromISO(schedule.startAt)} - {extractTimeFromISO(schedule.endAt)}
                  </div>
                  <div className="text-[13px] text-gray-500 font-medium">
                    신청 인원: <span className={schedule.currentParticipants > 0 ? "text-primary font-bold" : ""}>
                      {schedule.currentParticipants}
                    </span> / {schedule.maxParticipants}명
                  </div>
                </div>

                {schedule.currentParticipants === 0 && (
                  <button
                    onClick={() => deleteSchedule(schedule.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all md:opacity-0 md:group-hover:opacity-100"
                    title="상세 일정이 없는 경우에만 삭제 가능"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-400 text-sm font-medium">등록된 일정이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};
