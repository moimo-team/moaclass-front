import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';
import {
  createSchedules,
  deleteSchedule,
  deleteSchedules,
} from '@/api/schedule.api';
import type { CreateScheduleRequest } from '@/models/schedule.model';

export const useCreateSchedulesMutation = (lessonId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateScheduleRequest[]) =>
      createSchedules(lessonId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules', lessonId] });
      toast.success('일정이 등록되었습니다!');
    },
    onError: () => {
      toast.error('일정 등록 중 오류가 발생했습니다.');
    },
  });
};

// 신청자가 있으면 400 에러로 삭제 불가 안내
export const useDeleteScheduleMutation = (lessonId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules', lessonId] });
      toast.success('일정이 삭제되었습니다.');
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 400) {
        toast.error('신청자가 있어 삭제할 수 없습니다.');
      } else {
        toast.error('일정 삭제 중 오류가 발생했습니다.');
      }
    },
  });
};

export const useDeleteSchedulesMutation = (lessonId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSchedules,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules', lessonId] });
      toast.success('선택한 일정이 모두 삭제되었습니다.');
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 400) {
        toast.error('신청자가 있는 일정은 삭제할 수 없습니다.');
      } else {
        toast.error('일정 삭제 중 오류가 발생했습니다.');
      }
    },
  });
};
