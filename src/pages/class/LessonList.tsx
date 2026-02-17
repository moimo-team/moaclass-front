import React, { useEffect, useState } from 'react';

import { useSearchParams } from 'react-router-dom';

import PaginationComponent from '@/components/common/PaginationComponent';
import { LessonCard } from '@/components/features/lessons/LessonCard';
import { LessonFilterSection } from '@/components/features/lessons/LessonFilterSection';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { REVERSE_SORT_MAP, type SortEnum } from '@/constants/sortConstants';
import { useLessonsQuery } from '@/hooks/useLessonsQuery';
import type { FetchLessonsParams, Lesson } from '@/models/lesson.model';
import { useFilterStore } from '@/store/filterStore';
import type { FilterState } from '@/store/filterStore';

const LessonListDisplay: React.FC<{
	lessons: Lesson[];
	isLoading: boolean;
	isError: boolean;
	emptyMessage: string;
}> = ({ lessons, isLoading, isError, emptyMessage }) => {
	if (isLoading) return <div className="text-center p-8">로딩 중...</div>;
	if (isError)
		return (
			<div className="text-center p-8 text-red-500">데이터를 불러오는데 실패했습니다.</div>
		);
	if (lessons.length === 0)
		return <div className="text-center p-8 text-gray-500">{emptyMessage}</div>;

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
			{lessons.map((lesson) => (
				<LessonCard key={lesson.id} lesson={lesson} />
			))}
		</div>
	);
};

const LessonListPage: React.FC = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [isInitialized, setIsInitialized] = useState(false);
	const setAllFilters = useFilterStore((state) => state.setAllFilters);
	const resetFilters = useFilterStore((state) => state.resetFilters);
	const getFetchLessonsParams = useFilterStore((state) => state.getFetchLessonsParams);
	const selectedSort = useFilterStore((state) => state.selectedSort);
	const setSelectedSort = useFilterStore((state) => state.setSelectedSort);

	useEffect(() => {
		const filtersFromUrl: Partial<FilterState> = {
			selectedCategories: searchParams.get('categoryId')?.split(',') || [],
			selectedRegions: searchParams.get('regionId')?.split(',') || [],
			selectedDays: searchParams.get('days')?.split(',') || [],
			selectedDifficulty: searchParams.get('level')?.split(',') || [],
			selectedPersonnel: searchParams.get('maxParticipants') || '',
			selectedStatus: searchParams.get('status') || null,
			selectedSort: (searchParams.get('sort') as SortEnum) || null,
			timeRange: searchParams.get('timeRange')
				? (searchParams.get('timeRange')?.split('-').map(Number) as [number, number])
				: [0, 24],
			priceRange: [
				Number(searchParams.get('minPrice')) || 0,
				Number(searchParams.get('maxPrice')) || 500000,
			] as [number, number],
		};
		setAllFilters(filtersFromUrl);
		setIsInitialized(true);
	}, [searchParams, setAllFilters]);

	const currentPage = Number(searchParams.get('page')) || 1;
	//const itemsPerPage = 12; // TODO: 한 페이지에 보여줄 아이템 수 정의 필요

	const { data, isLoading, isError } = useLessonsQuery(
		getFetchLessonsParams(),
		currentPage,
		isInitialized,
	);

	const { totalPages } = { totalPages: data?.meta?.totalPages || 0 };

	const handlePageChange = (page: number) => {
		searchParams.set('page', String(page));
		setSearchParams(searchParams);
		window.scrollTo(0, 0);
	};

	const handleSearchClick = (mappedParams: FetchLessonsParams) => {
		const params = new URLSearchParams();
		Object.entries(mappedParams).forEach(([key, value]) => {
			if (value === undefined || value === null) return;
			if (Array.isArray(value)) {
				value.forEach((item) => params.append(key, String(item)));
			} else {
				params.append(key, String(value));
			}
		});
		params.set('page', '1'); // 검색 시 페이지 1로 초기화
		setSearchParams(params);
	};

	const handleResetAllFilters = () => {
		resetFilters();
		setSearchParams({});
		window.scrollTo(0, 0);
	};

	return (
		<div className="container mx-auto py-8">
			<h1 className="text-3xl font-bold mb-6">클래스 목록</h1>

			<LessonFilterSection
				showCloseButton={false}
				onSearch={handleSearchClick}
				onReset={handleResetAllFilters}
			/>

			<div className="my-8 flex justify-end">
				<Select
					value={selectedSort || 'LATEST'}
					onValueChange={(value: string) => setSelectedSort(value as SortEnum)}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="정렬 기준" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="LATEST">생성일 최신순</SelectItem>{' '}
						{Object.entries(REVERSE_SORT_MAP).map(
							([backendValue, frontendName]) =>
								backendValue !== 'LATEST' && (
									<SelectItem key={backendValue} value={backendValue as SortEnum}>
										{frontendName}
									</SelectItem>
								),
						)}
					</SelectContent>
				</Select>
			</div>

			<div className="my-8">
				<LessonListDisplay
					lessons={data?.data || []}
					isLoading={isLoading}
					isError={isError}
					emptyMessage="조건에 맞는 클래스가 없습니다."
				/>
			</div>

			<div className="flex justify-center mt-8">
				<PaginationComponent
					page={currentPage}
					totalPages={totalPages}
					setPage={handlePageChange}
				/>
			</div>
		</div>
	);
};

export default LessonListPage;
