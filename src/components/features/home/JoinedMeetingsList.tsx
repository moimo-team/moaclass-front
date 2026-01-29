import MeetingList from "@/components/features/home/MeetingList";
import { useMeQuery } from "@/hooks/useMeQuery";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useAuthStore } from "@/store/authStore";

function JoinedMeetingsList() {
  const { nickname } = useAuthStore();
  const { meetings, isLoading, isError, error } = useMeQuery(
    "joined",
    "accepted",
    1,
    4,
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <p className="text-center text-red-500">
        모임을 불러오는 중 에러가 발생했습니다: {error?.message}
      </p>
    );
  }

  if (!isLoading && (!meetings || meetings.length === 0)) {
    return null;
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-8">
      <div className="text-xl font-bold mb-4">{nickname} 님이 가입한 모임</div>
      <MeetingList meetings={meetings} />
    </div>
  );
}

export default JoinedMeetingsList;
