'use client';

import { useState, useEffect } from 'react';

import { useSearchParams, useRouter } from 'next/navigation';

import LoadingSpinner from '@/components/common/LoadingSpinner';
import PaginationComponent from '@/components/common/PaginationComponent';
import MeetingList from '@/components/features/home/MeetingList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSearchMeetingsQuery } from '@/hooks/useMeetingsQuery';
import { usePagination } from '@/hooks/usePagination';
import { scrollToTop } from '@/utils/setScrollTo';

const MeetingsSearchClient = () => {
	const searchParams = useSearchParams();
	const router = useRouter();

	const keyword = searchParams.get('keyword') || '';
	const page = Number(searchParams.get('page') || '1');
	const limit = Number(searchParams.get('limit') || '10');

	const [inputValue, setInputValue] = useState(keyword);

	const handleSearch = (event: React.FormEvent) => {
		event.preventDefault();
		if (!inputValue.trim()) return;

		// 페이지를 1로 초기화하며 새로운 검색 실행
		router.push(
			`/meetings/search?keyword=${encodeURIComponent(inputValue)}&page=1&limit=${limit}`,
		);
	};

	const setPage = (newPage: number) => {
		router.push(
			`/meetings/search?keyword=${encodeURIComponent(keyword)}&page=${newPage}&limit=${limit}`,
		);
	};

	useEffect(() => {
		setInputValue(keyword);
	}, [keyword]);

	useEffect(() => {
		scrollToTop();
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
		<section className="space-y-4 bg-card pt-4" aria-label="모임 검색 페이지">
			<h1 className="text-3xl font-bold p-4">모임 검색 결과</h1>

			<section className="px-4" aria-label="검색 폼">
				<form onSubmit={handleSearch} className="flex gap-3 w-full max-w-2xl pl-4 pb-4">
					<Input
						type="text"
						placeholder="관심있는 모임 제목을 검색해 보세요"
						className="flex-1 h-12 text-lg px-5 shadow-sm"
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
					/>
					<Button
						type="submit"
						className="h-12 px-8 text-md font-medium shrink-0 shadow-sm"
					>
						찾기
					</Button>
				</form>
			</section>

			{isLoading && <LoadingSpinner />}
			{isError && <p className="text-center text-red-500">검색 중 에러가 발생했습니다.</p>}

			{!isLoading && !isError && meetings.length > 0 && (
				<section className="max-w-6xl mx-auto" aria-label="검색 결과">
					<p className="px-4 pb-8 text-lg">
						총 <span className="font-bold">{meetingsResponse?.meta.totalCount}</span>
						개의 모임을 찾았습니다.
					</p>
					<MeetingList meetings={meetings} />
				</section>
			)}

			{!isLoading && !isError && meetings.length === 0 && keyword && (
				<p className="text-center py-16">'{keyword}'에 대한 검색 결과가 없습니다.</p>
			)}

			<section className="py-8" aria-label="페이지네이션">
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
			</section>
		</section>
	);
};

export default MeetingsSearchClient;
