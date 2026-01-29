import LoadingSpinner from "@/components/common/LoadingSpinner";
import MeetingActionButtons from "@/components/features/meetings/MeetingActionButtons";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMeQuery } from "@/hooks/useMeQuery";
import { useState } from "react";
import { Link } from "react-router-dom";
import SmallMeetingCard from "@/components/features/mypage/SmallMeetingCard";

const JoinedMeeting = () => {
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const { meetings: joinedMeetings, totalPages, isLoading } = useMeQuery('joined', filter, page, 5);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="w-full h-full py-10 bg-white overflow-y-auto">
      <div className="flex justify-between items-start mb-8">
        <h1 className="text-2xl font-bold text-gray-900">참여 모임</h1>
        <Select value={filter} onValueChange={(value) => { setFilter(value); setPage(1); }}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="전체" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="pending">승인대기</SelectItem>
            <SelectItem value="accepted">참석예정</SelectItem>
            <SelectItem value="completed">참석완료</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4 mb-10">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {joinedMeetings?.map((meeting) => (
              <SmallMeetingCard key={meeting.meetingId} meeting={meeting}>
                <MeetingActionButtons
                  meetingId={meeting.meetingId}
                  role="participant"
                  location="joined-list"
                  isPending={meeting.status === 'PENDING'}
                  isJoined={meeting.status === 'ACCEPTED' || meeting.isCompleted}
                  isLoggedIn={true}
                />
              </SmallMeetingCard>
            ))}

            {/* Empty State */}
            {(!joinedMeetings || joinedMeetings.length === 0) && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">아직 참여한 모임이 없어요 :&lt;</h3>
                <Link to="/meetings" className="text-gray-900 font-bold flex items-center hover:underline">
                  첫번째 모임을 찾아볼까요? &gt;
                </Link>
              </div>
            )}
          </>
        )}
      </div>

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
    </div>
  )
}

export default JoinedMeeting;