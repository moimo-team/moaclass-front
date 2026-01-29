import { useState } from "react";
import { useDeleteMeetingMutation } from "./useMeetingMutations";
import { toast } from "sonner";
import ConfirmDialog from "@/components/common/ConfirmDialog";

interface UseDeleteMeetingDialogOptions {
  onSuccess?: () => void;
}

export const useDeleteMeetingDialog = (options?: UseDeleteMeetingDialogOptions) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [meetingToDelete, setMeetingToDelete] = useState<number | null>(null);
  const deleteMeetingMutation = useDeleteMeetingMutation();

  const handleDeleteMeeting = (meetingId: number) => {
    setMeetingToDelete(meetingId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!meetingToDelete) return;

    try {
      await deleteMeetingMutation.mutateAsync(meetingToDelete);
      toast.success("모임이 삭제되었습니다");
      setShowDeleteConfirm(false);
      setMeetingToDelete(null);

      // 성공 콜백 실행
      if (options?.onSuccess) {
        options.onSuccess();
      }
    } catch (error: any) {
      console.error("모임 삭제 에러:", error);
      const errorMessage = error.response?.data?.message || "모임 삭제에 실패했습니다";
      toast.error(errorMessage);
      setShowDeleteConfirm(false);
      setMeetingToDelete(null);
    }
  };

  const DeleteConfirmDialog = () => (
    <ConfirmDialog
      open={showDeleteConfirm}
      onOpenChange={setShowDeleteConfirm}
      title="모임 삭제"
      description="삭제된 모임은 복구할 수 없습니다. 정말 삭제하시겠습니까?"
      confirmText="삭제"
      cancelText="취소"
      onConfirm={handleConfirmDelete}
    />
  );

  return {
    handleDeleteMeeting,
    DeleteConfirmDialog,
  };
};
