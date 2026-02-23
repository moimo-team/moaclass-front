import { useEffect } from 'react';

import { useSearchParams } from 'react-router-dom';

import type {
	FinishedFilterType,
	InterestFilterType,
	SortType,
	GetMeetingsParams,
} from '@/api/meeting.api';
import PaginationComponent from '@/components/common/PaginationComponent';
import MeetingList from '@/components/features/home/MeetingList';
import { MeetingFilterControls } from '@/components/features/meetings/MeetingFilterControls';
import { Skeleton } from '@/components/ui/skeleton';
import { useInterestQuery } from '@/hooks/useInterestQuery';
import { useMeetingFilter } from '@/hooks/useMeetingFilter';
import { useMeetingsQuery } from '@/hooks/useMeetingsQuery';
import { usePagination } from '@/hooks/usePagination';
import { scrollToTop } from '@/utils/setScrollTo';

const MeetingsPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	// URL에서 직접 상태 읽기
	const { filters } = useMeetingFilter(searchParams);
	const page = Number(searchParams.get('page') || '1');
	const limit = Number(searchParams.get('limit') || '12');

	// URL 업데이트 로직
	const updateUrlParams = (newValues: Partial<GetMeetingsParams>) => {
		const newSearchParams = new URLSearchParams(searchParams);
		Object.entries(newValues).forEach(([key, value]) => {
			newSearchParams.set(key, String(value));
		});

		setSearchParams(newSearchParams);
	};

	const handleFilterChange = (
		key: 'sort' | 'interestFilter' | 'finishedFilter' | 'limit',
		value: string | number | boolean,
	) => {
		// 페이지를 1로 초기화하며 필터 변경
		updateUrlParams({
			[key]: value,
			page: 1,
		} as Partial<GetMeetingsParams>);
	};

	const setPage = (newPage: number) => {
		updateUrlParams({ page: newPage });
	};

	useEffect(() => {
		scrollToTop();
	}, [page]);

	const {
		data: meetingsResponse,
		isLoading,
		isError,
	} = useMeetingsQuery({ page, limit, ...filters });

	const { data: interestsData, isLoading: isInterestsLoading } = useInterestQuery();

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
		<section className="space-y-4 bg-card" aria-label="모임 목록 페이지">
			<h1 className="text-3xl font-bold py-8 px-4">원하는 모임 찾기</h1>

			<section aria-label="모임 필터">
				<MeetingFilterControls
					filters={filters}
					limit={limit}
					interestsData={interestsData}
					isInterestsLoading={isInterestsLoading}
					handleSortChange={(v: SortType) => handleFilterChange('sort', v)}
					handleInterestFilterChange={(v: InterestFilterType) =>
						handleFilterChange('interestFilter', v)
					}
					handleFinishedFilterChange={(v: FinishedFilterType) =>
						handleFilterChange('finishedFilter', v)
					}
					handleLimitChange={(v: number) => handleFilterChange('limit', v)}
				/>
			</section>

			{isLoading && (
				<div className="w-full max-w-6xl mx-auto py-8">
					<div className="grid grid-cols-4 gap-4 justify-items-center">
						{[...Array(limit)].map((_, index) => (
							<Skeleton key={index} className="w-48 h-60 rounded-lg" />
						))}
					</div>
				</div>
			)}
			{isError && (
				<p className="text-center text-red-500">모임을 불러오는 중 에러가 발생했습니다.</p>
			)}

			{!isLoading && !isError && meetings.length > 0 && (
				<section className="max-w-6xl mx-auto" aria-label="모임 목록 결과">
					<MeetingList meetings={meetings} />
				</section>
			)}

			{!isLoading && !isError && meetings.length === 0 && (
				<p className="text-center py-16">해당 조건의 모임이 없습니다.</p>
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

export default MeetingsPage;
