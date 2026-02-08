import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createLesson,
  updateLesson,
  deleteLesson,
  addLessonSchedule,
} from "@/api/lesson.api";
import { toast } from "sonner";

/**
 * 1. 클래스 생성 Mutation
 */
export const useCreateLessonMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createLesson,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lessons"] });
            toast.success("레슨이 생성되었습니다.");
        },
        onError: (error: any) => {
            console.error("레슨 생성 실패:", error);
            toast.error("레슨 생성에 실패했습니다.");
        }
    });
};

/**
 * 2. 클래스 수정 Mutation
 */
export const useUpdateLessonMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ lessonId, formData }: { lessonId: number; formData: FormData }) => 
            updateLesson(lessonId, formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lessons"] });
            toast.success("레슨이 수정되었습니다.");
        },
        onError: (error: any) => {
            console.error("레슨 수정 실패:", error);
            toast.error("레슨 수정에 실패했습니다.");
        }
    });
};

/**
 * 3. 클래스 삭제 Mutation
 */
export const useDeleteLessonMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteLesson,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lessons"] });
            toast.success("레슨이 삭제되었습니다.");
        },
        onError: (error: any) => {
            console.error("레슨 삭제 실패:", error);
            toast.error("레슨 삭제에 실패했습니다.");
        }
    });
};

