import { useState } from "react";
import SmallMeetingCard from "@/components/features/mypage/SmallMeetingCard";
import { useMeQuery } from "@/hooks/useMeQuery";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Link } from "react-router-dom";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import CreateMeetingModal from "@/components/features/meetings/CreateMeetingModal";
import MeetingActionButtons from "@/components/features/meetings/MeetingActionButtons";
import type { MyMeetingsResponse } from "@/api/me.api";

import { useDeleteMeetingDialog } from "@/hooks/useDeleteMeetingDialog";
import { useParticipationsQuery } from "@/hooks/useParticipationsQuery";

const MeetingCardWithBadge = ({
  meeting,
  onEdit,
  onDelete
}: {
  meeting: MyMeetingsResponse;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const { data: participations, isLoading } = useParticipationsQuery(meeting.meetingId);
  const hasPendingApplicants = participations?.some(p => p.status === 'PENDING');

  if (isLoading) {
    return <div className="w-full h-[108px] bg-gray-50 animate-pulse rounded-xl border border-gray-100" />;
  }

  return (
    <SmallMeetingCard
      meeting={meeting}
      hasPendingApplicants={hasPendingApplicants}
    >
      <MeetingActionButtons
        meetingId={meeting.meetingId}
        role="host"
        location="hosting-list"
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </SmallMeetingCard>
  );
};

const HostMeeting = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<MyMeetingsResponse | null>(null);
  const [page, setPage] = useState(1);
  const { meetings: hostedMeetings, totalPages, isLoading } = useMeQuery('hosted', 'all', page, 5);
  const { handleDeleteMeeting, DeleteConfirmDialog } = useDeleteMeetingDialog();

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="w-full h-full py-10 bg-white overflow-y-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">내 모임</h1>

      {/* 내가 만든 모임 */}
      <div className="space-y-4 mb-10">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {hostedMeetings?.map((meeting) => (
              <MeetingCardWithBadge
                key={meeting.meetingId}
                meeting={meeting}
                onEdit={() => {
                  setSelectedMeeting(meeting);
                  setIsModalOpen(true);
                }}
                onDelete={() => handleDeleteMeeting(meeting.meetingId)}
              />
            ))}
            {/* Empty State */}
            {(!hostedMeetings || hostedMeetings.length === 0) && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">아직 만든 모임이 없어요 :&lt;</h3>
                <Link to="/moimer-intro" className="text-gray-900 font-bold flex items-center hover:underline">
                  첫번째 모임을 만들어볼까요? &gt;
                </Link>
              </div>
            )}
          </>
        )}
      </div>

      {/* 모임 수정 모달 */}
      <CreateMeetingModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setSelectedMeeting(null);
        }}
        meeting={selectedMeeting || undefined} // Pass selected meeting for editing
      />

      {totalPages > 0 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => { e.preventDefault(); if (page > 1) handlePageChange(page - 1); }}
                className={page === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  href="#"
                  isActive={page === pageNum}
                  onClick={(e) => { e.preventDefault(); handlePageChange(pageNum); }}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => { e.preventDefault(); if (page < totalPages) handlePageChange(page + 1); }}
                className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* 삭제 확인 모달 */}
      <DeleteConfirmDialog />
    </div>
  )
}

export default HostMeeting;