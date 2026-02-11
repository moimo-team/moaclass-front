import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSchedules, deleteSchedule } from '@/api/schedule.api';
import type { CreateScheduleRequest } from '@/models/schedule.model';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';

/**
 * 일정 일괄 등록 Mutation
 * 개별/반복 등록 모두 배열로 전송
 */
export const useCreateSchedulesMutation = (lessonId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateScheduleRequest[]) =>
      createSchedules(lessonId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules', lessonId] });
      toast.success('일정이 등록되었습니다!');
    },
    onError: (error: Error) => {
      toast.error('일정 등록 중 오류가 발생했습니다.');
      console.error('Create schedules error:', error);
    },
  });
};

/**
 * 일정 삭제 Mutation
 * 신청자가 있으면 400 에러 처리
 */
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
      console.error('Delete schedule error:', error);
    },
  });
};
