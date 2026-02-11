import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useScheduleQuery } from "@/hooks/useScheduleQuery";

export default function ScheduleManagementPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useScheduleQuery(Number(lessonId));

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-red-500">일정을 불러올 수 없습니다.</p>
        <Button onClick={() => navigate(-1)}>돌아가기</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">일정 및 예약 관리</h1>
            <p className="text-sm text-gray-500 mt-1">클래스 ID: {lessonId}</p>
          </div>
        </div>

        <Button>일정 등록</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">캘린더</h2>
          <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-400">
            캘린더 컴포넌트 (Phase 2에서 구현 예정)
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">선택한 날짜의 일정</h2>
          <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-400">
            일정 목록 (Phase 3에서 구현 예정)
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded text-xs">
            <p className="font-semibold mb-2">불러온 일정 수:</p>
            <p>{data?.raw.length || 0}개</p>
          </div>
        </div>
      </div>
    </div>
  );
}
