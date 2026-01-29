import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ParticipationDetail } from "@/models/participation.model";
import {
  useApproveParticipation,
  useRejectParticipation,
  useCancelApprovalParticipation,
  useCancelRejectParticipation
} from "@/hooks/useParticipateMutations";

import { useState } from "react";
import ProfileModal from "./ProfileModal";
import defaultProfile from "@/assets/images/profile.png";
import MeetingActionButtons from "@/components/features/meetings/MeetingActionButtons";
import { toast } from "sonner";

interface ParticipantCardProps {
  meetingId: number;
  participant: ParticipationDetail;
}

const ParticipantCard = ({ meetingId, participant }: ParticipantCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate: approve, isPending: isApprovePending } = useApproveParticipation();
  const { mutate: reject, isPending: isRejectPending } = useRejectParticipation();
  const { mutate: cancelApproval, isPending: isCancelApprovePending } = useCancelApprovalParticipation();
  const { mutate: cancelReject, isPending: isCancelRejectPending } = useCancelRejectParticipation();

  const isLoading = isApprovePending || isRejectPending || isCancelApprovePending || isCancelRejectPending;

  const handleApprove = () =>
    approve(
      { meetingId, participationId: participant.participationId },
      { onSuccess: () => toast.success("해당 모이미를 승인했습니다.") }
    );
  const handleReject = () =>
    reject(
      { meetingId, participationId: participant.participationId },
      { onSuccess: () => toast.success("해당 모이미를 거절했습니다.") }
    );
  const handleCancel = () =>
    cancelApproval(
      { meetingId, participationId: participant.participationId },
      { onSuccess: () => toast.success("해당 모이미의 승인이 취소되었습니다.") }
    );
  const handleReset = () => {
    cancelReject(
      { meetingId, participationId: participant.participationId },
      { onSuccess: () => toast.success("해당 모이미의 거절이 취소되었습니다.") }
    );
  };


  return (
    <div
      className="flex justify-between items-center p-4 border border-[#FFB800] rounded-xl bg-white shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <Avatar
            className="w-10 h-10 bg-gray-200"
          >
            <AvatarImage
              src={participant.profileImage || defaultProfile}
              alt={participant.nickname || "user"}
              className="object-cover"
            />
            <AvatarFallback>{participant.nickname[0]}</AvatarFallback>
          </Avatar>
          <span className="text-lg font-medium text-gray-700">{participant.nickname}</span>
        </div>
      </div>
      <MeetingActionButtons
        meetingId={meetingId}
        role="applicant"
        applicantStatus={participant.status}
        onApprove={handleApprove}
        onReject={handleReject}
        onCancelApproval={handleCancel}
        onCancelReject={handleReset}
        isLoading={isLoading}
      />

      <ProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userInfo={{ ...participant, interests: participant.interests || [] }}
        userId={participant.userId}
        readOnly={true}
      />
    </div>
  );
};

export default ParticipantCard;
