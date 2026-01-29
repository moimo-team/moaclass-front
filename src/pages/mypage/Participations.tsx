import { useState } from "react";
import { toast } from "sonner";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ParticipantCard from "@/components/features/mypage/ParticipantCard";
import ParticipantSection from "@/components/features/mypage/ParticipantSection";
import { useParticipationsQuery } from "@/hooks/useParticipationsQuery";
import { useApproveAllParticipations } from "@/hooks/useParticipateMutations";
import { UserCheck, ChevronLeft } from "lucide-react";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const Participations = () => {
  const { id } = useParams<{ id: string }>();
  const meetingId = Number(id);

  const [isWaitingOpen, setIsWaitingOpen] = useState(true);
  const [isConfirmedOpen, setIsConfirmedOpen] = useState(true);
  const [isRejectedOpen, setIsRejectedOpen] = useState(false);
  const { data: participants, isLoading } = useParticipationsQuery(meetingId);
  const { mutate: approveAll, isPending: isApproveAllPending } = useApproveAllParticipations();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleApproveAll = () => {
    approveAll(
      { meetingId },
      { onSuccess: () => toast.success("모든 모이미기 승인되었습니다!") }
    );
  };

  const waitingParticipants = participants?.filter((participant) => participant.status === "PENDING") || [];
  const confirmedParticipants = participants?.filter((participant) => participant.status === "ACCEPTED") || [];
  const rejectedParticipants = participants?.filter((participant) => participant.status === "REJECTED") || [];

  return (
    <div className="w-full h-full pt-10 bg-white overflow-y-auto">
      <div className="flex items-center gap-2 mb-8">
        <button
          onClick={handleBack}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="뒤로 가기"
        >
          <ChevronLeft className="w-8 h-8 text-gray-900" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">모이미 관리</h1>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-[400px]">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {/* 참여 대기 멤버 섹션 */}
          <ParticipantSection
            title="승인 대기 중"
            count={waitingParticipants.length}
            isOpen={isWaitingOpen}
            onToggle={() => setIsWaitingOpen(!isWaitingOpen)}
            actionButton={
              <Button
                variant="outline"
                className="border-2 border-[#FFB800] text-[#FFB800] hover:bg-[#FFB800]/10 font-semibold h-10 px-4 rounded-md text-xs shadow-none gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleApproveAll();
                }}
                disabled={isApproveAllPending}
              >
                <UserCheck className="w-3 h-3" fill="currentColor" />
                모두승인
              </Button>
            }
          >
            {waitingParticipants.map((participant) => (
              <ParticipantCard key={participant.participationId} meetingId={meetingId} participant={participant} />
            ))}
          </ParticipantSection>

          {/* 승인된 멤버 섹션 */}
          <ParticipantSection
            title="승인된 모이미"
            count={confirmedParticipants.length}
            isOpen={isConfirmedOpen}
            onToggle={() => setIsConfirmedOpen(!isConfirmedOpen)}
          >
            {confirmedParticipants.map((participant) => (
              <ParticipantCard key={participant.participationId} meetingId={meetingId} participant={participant} />
            ))}
          </ParticipantSection>

          {/* 거절된 멤버 섹션 */}
          <ParticipantSection
            title="거절된 모이미"
            count={rejectedParticipants.length}
            isOpen={isRejectedOpen}
            onToggle={() => setIsRejectedOpen(!isRejectedOpen)}
            contentClassName="opacity-60"
          >
            {rejectedParticipants.map((participant) => (
              <ParticipantCard key={participant.participationId} meetingId={meetingId} participant={participant} />
            ))}
          </ParticipantSection>
        </>
      )}
    </div>
  );
};

export default Participations;