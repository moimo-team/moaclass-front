import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MeetingList from "@/components/features/home/MeetingList";
import PaginationComponent from "@/components/common/PaginationComponent";
import { useSearchMeetingsQuery } from "@/hooks/useMeetingsQuery";
import { usePagination } from "@/hooks/usePagination";
import LoadingSpinner from '@/components/common/LoadingSpinner';

const MeetingsSearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "10");

  const [inputValue, setInputValue] = useState(keyword);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (!inputValue.trim()) return;

    // 페이지를 1로 초기화하며 새로운 검색 실행
    setSearchParams({ keyword: inputValue, page: "1", limit: String(limit) });
  };

  const setPage = (newPage: number) => {
    setSearchParams({ keyword, page: String(newPage), limit: String(limit) });
  };

  useEffect(() => {
    setInputValue(keyword);
  }, [keyword]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, keyword]);

  const {
    data: meetingsResponse,
    isLoading,
    isError,
  } = useSearchMeetingsQuery({ keyword, page, limit });

  const { totalPages, isFirstPage, isLastPage } = usePagination({
    page,
    limit,
    totalCount: meetingsResponse?.meta?.totalCount ?? 0,
    apiTotalPages: meetingsResponse?.meta?.totalPages ?? 1,
  });

  const goToNextPage = () => {
    if (!isLastPage) {
      setPage(page + 1);
    }
  };

  const goToPreviousPage = () => {
    if (!isFirstPage) {
      setPage(page - 1);
    }
  };

  const meetings = meetingsResponse?.data || [];

  return (
    <div className="space-y-4 bg-card pt-4">
      <h1 className="text-3xl font-bold p-4">모임 검색 결과</h1>

      <div className="px-4">
        <form onSubmit={handleSearch} className="flex gap-3 w-full max-w-2xl pl-4 pb-4">
          <Input
            type="text"
            placeholder="관심있는 모임 제목을 검색해 보세요"
            className="flex-1 h-12 text-lg px-5 shadow-sm"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Button type="submit" className="h-12 px-8 text-md font-meduium shrink-0 shadow-sm">
            찾기
          </Button>
        </form>
      </div>

      {isLoading && (
        <LoadingSpinner />
      )}
      {isError && (
        <p className="text-center text-red-500">
          검색 중 에러가 발생했습니다.
        </p>
      )}

      {!isLoading && !isError && meetings.length > 0 && (
        <div className="max-w-6xl mx-auto">
          <p className="px-4 pb-8 text-lg">
            총 <span className="font-bold">{meetingsResponse?.meta.totalCount}</span>개의 모임을 찾았습니다.
          </p>
          <MeetingList meetings={meetings} />
        </div>
      )}

      {!isLoading && !isError && meetings.length === 0 && (
        <p className="text-center py-16">
          '{keyword}'에 대한 검색 결과가 없습니다.
        </p>
      )}

      <div className="py-8">
        {meetings.length > 0 && (
          <PaginationComponent
            totalPages={totalPages}
            page={page}
            setPage={setPage}
            goToNextPage={goToNextPage}
            goToPreviousPage={goToPreviousPage}
            isFirstPage={isFirstPage}
            isLastPage={isLastPage}
          />
        )}
      </div>
    </div>
  );
};

export default MeetingsSearchPage;
