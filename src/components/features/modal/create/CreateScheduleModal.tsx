import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Trash2, Calendar as CalendarIcon } from "lucide-react";
import { format, eachDayOfInterval } from "date-fns";
import { FormModal } from "@/components/features/modal/components/FormModal";
import { FormInput } from "@/components/features/modal/components/FormInput";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCreateSchedulesMutation } from "@/hooks/useScheduleMutations";
import { combineDateAndTime, isEndTimeAfterStartTime } from "@/utils/scheduleHelpers";
import { toast } from "sonner";

interface CreateScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonId: number;
  selectedDates: Date[];
}

export const CreateScheduleModal = ({
  isOpen,
  onClose,
  lessonId,
  selectedDates,
}: CreateScheduleModalProps) => {
  const { mutate: createSchedules, isPending } = useCreateSchedulesMutation(lessonId);
  const [activeTab, setActiveTab] = useState("single");

  const singleForm = useForm({
    defaultValues: {
      timeSlots: [{ startTime: "09:00", endTime: "10:00" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: singleForm.control,
    name: "timeSlots",
  });

  const onSingleSubmit = (data: { timeSlots: { startTime: string; endTime: string }[] }) => {
    if (selectedDates.length === 0) {
      toast.error("날짜를 하나 이상 선택해 주세요.");
      return;
    }

    const schedules = selectedDates.flatMap((date) =>
      data.timeSlots.map((slot) => {
        if (!isEndTimeAfterStartTime(slot.startTime, slot.endTime)) {
          throw new Error(`${format(date, "MM/dd")}의 시간이 올바르지 않습니다.`);
        }
        return {
          startAt: combineDateAndTime(date, slot.startTime),
          endAt: combineDateAndTime(date, slot.endTime),
        };
      })
    );

    try {
      createSchedules(schedules, { onSuccess: onClose });
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const recurringForm = useForm({
    defaultValues: {
      startDate: format(new Date(), "yyyy-MM-dd"),
      endDate: format(new Date(), "yyyy-MM-dd"),
      startTime: "09:00",
      endTime: "10:00",
    },
  });

  const onRecurringSubmit = (data: any) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);

    if (start > end) {
      toast.error("시작일이 종료일보다 늦을 수 없습니다.");
      return;
    }

    if (!isEndTimeAfterStartTime(data.startTime, data.endTime)) {
      toast.error("종료 시간이 시작 시간보다 빨라야 합니다.");
      return;
    }

    const dates = eachDayOfInterval({ start, end });
    const schedules = dates.map((date) => ({
      startAt: combineDateAndTime(date, data.startTime),
      endAt: combineDateAndTime(date, data.endTime),
    }));

    createSchedules(schedules, { onSuccess: onClose });
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="새 일정 등록"
      showFooter={false}
      containerClassName="max-w-md"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 p-1 bg-gray-100/50 rounded-xl mb-6">
          <TabsTrigger value="single" className="rounded-lg font-bold py-2.5">
            개별 등록
          </TabsTrigger>
          <TabsTrigger value="recurring" className="rounded-lg font-bold py-2.5">
            반복 등록
          </TabsTrigger>
        </TabsList>

        <div className="space-y-6">
          <TabsContent value="single" className="mt-0 space-y-6 outline-none">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-gray-700">선택된 날짜 ({selectedDates.length})</Label>
              <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-xl border border-gray-100 max-h-32 overflow-y-auto">
                {selectedDates.length > 0 ? (
                  selectedDates.map((date) => (
                    <span key={date.toISOString()} className="px-2.5 py-1 bg-white border border-gray-200 rounded-md text-xs font-bold text-gray-600 shadow-sm">
                      {format(date, "MM/dd")}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 font-bold">캘린더에서 날짜를 먼저 선택해 주세요.</p>
                )}
              </div>
            </div>

            <form onSubmit={singleForm.handleSubmit(onSingleSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-bold text-gray-700">시간 설정</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => append({ startTime: "09:00", endTime: "10:00" })}
                    className="h-8 text-primary font-bold gap-1 hover:bg-primary/5 px-2"
                  >
                    <Plus className="w-4 h-4" /> 슬롯 추가
                  </Button>
                </div>

                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      <FormInput
                        id={`start-${index}`}
                        type="time"
                        register={singleForm.register(`timeSlots.${index}.startTime` as const)}
                      />
                      <span className="text-gray-400 font-bold self-center mt-2">~</span>
                      <FormInput
                        id={`end-${index}`}
                        type="time"
                        register={singleForm.register(`timeSlots.${index}.endTime` as const)}
                      />
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          className="h-12 w-12 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg shrink-0 mt-2 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isPending || selectedDates.length === 0}
                className="w-full h-14 rounded-xl font-bold text-lg shadow-md transition-all mt-4"
              >
                {isPending ? "등록 중..." : `${selectedDates.length}개 날짜에 등록`}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="recurring" className="mt-0 space-y-6 outline-none">
            <form onSubmit={recurringForm.handleSubmit(onRecurringSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  id="startDate"
                  label="시작일"
                  type="date"
                  register={recurringForm.register("startDate")}
                />
                <FormInput
                  id="endDate"
                  label="종료일"
                  type="date"
                  register={recurringForm.register("endDate")}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  id="startTime"
                  label="시작 시간"
                  type="time"
                  register={recurringForm.register("startTime")}
                />
                <FormInput
                  id="endTime"
                  label="종료 시간"
                  type="time"
                  register={recurringForm.register("endTime")}
                />
              </div>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                <CalendarIcon className="w-5 h-5 text-amber-500 shrink-0" />
                <p className="text-xs text-amber-700 leading-normal font-bold">
                  선택한 기간 내의 모든 날짜에 동일한 시간으로 일정이 생성됩니다.
                </p>
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-14 rounded-xl font-bold text-lg shadow-md transition-all mt-2"
              >
                {isPending ? "등록 중..." : "일정 일괄 등록"}
              </Button>
            </form>
          </TabsContent>
        </div>
      </Tabs>
    </FormModal>
  );
};
