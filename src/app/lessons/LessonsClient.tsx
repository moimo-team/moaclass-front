'use client';

import React, { useEffect, useState } from 'react';

import { useSearchParams, useRouter } from 'next/navigation';

import LoadingSpinner from '@/components/common/LoadingSpinner';
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
import { REVERSE_DAYS_MAP } from '@/constants/dayConstants';
import { LEVEL_MAP } from '@/constants/lessonConstants';
import { REVERSE_SORT_MAP, type SortEnum } from '@/constants/sortConstants';
import { useLessonsQuery } from '@/hooks/useLessonsQuery';
import type { FetchLessonsParams, Lesson } from '@/models/lesson.model';
import { useFilterStore } from '@/store/filterStore';
import type { FilterState } from '@/store/filterStore';
import { buildLessonFilterSearchParams, parseMultiValueParam } from '@/utils/lessonFilterQuery';
import { scrollToTop } from '@/utils/setScrollTo';

const LessonListDisplay: React.FC<{
	lessons: Lesson[];
	isLoading: boolean;
	isError: boolean;
	emptyMessage: string;
}> = ({ lessons, isLoading, isError, emptyMessage }) => {
	if (isLoading) return <LoadingSpinner />;
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

export function LessonsClient() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [isInitialized, setIsInitialized] = useState(false);
	const setAllFilters = useFilterStore((state) => state.setAllFilters);
	const resetFilters = useFilterStore((state) => state.resetFilters);
	const getFetchLessonsParams = useFilterStore((state) => state.getFetchLessonsParams);
	const selectedSort = useFilterStore((state) => state.selectedSort);
	const setSelectedSort = useFilterStore((state) => state.setSelectedSort);

	useEffect(() => {
		const categoryIds = parseMultiValueParam(searchParams, 'categoryId');
		const subCategoryIds = parseMultiValueParam(searchParams, 'subCategoryId');
		const statusValues = parseMultiValueParam(searchParams, 'status');
		const dayValues = parseMultiValueParam(searchParams, 'days');
		const levelValues = parseMultiValueParam(searchParams, 'level');

		const filtersFromUrl: Partial<FilterState> = {
			selectedCategories: [],
			selectedRegions: parseMultiValueParam(searchParams, 'regionId'),
			selectedDays: dayValues.map((value) => REVERSE_DAYS_MAP[value] ?? value),
			selectedDifficulty: levelValues.map(
				(value) => LEVEL_MAP[value as keyof typeof LEVEL_MAP] ?? value,
			),
			selectedSubCategoryIds: subCategoryIds
				.map((subCategoryIdText) => Number(subCategoryIdText))
				.filter((subCategoryId) => !Number.isNaN(subCategoryId)),
			activeMainCategoryId:
				categoryIds.length > 0 && !Number.isNaN(Number(categoryIds[0]))
					? Number(categoryIds[0])
					: null,
			selectedPersonnel: searchParams.get('maxParticipants') || '',
			selectedStatus:
				statusValues.length > 0 ? (statusValues[0] as FilterState['selectedStatus']) : null,
			selectedSort: (searchParams.get('sort') as SortEnum) || null,
			timeRange: searchParams.get('timeRange')
				? (searchParams.get('timeRange')?.split('-').map(Number) as [number, number])
				: [0, 24],
			priceRange: [
				Number(searchParams.get('minPrice')) || 0,
				Number(searchParams.get('maxPrice')) || 500000,
			] as [number, number],
			keyword: searchParams.get('keyword') || undefined,
			isLiked:
				searchParams.get('isLiked') === null
					? undefined
					: searchParams.get('isLiked') === 'true',
			finishedFilter:
				searchParams.get('finishedFilter') === null
					? undefined
					: searchParams.get('finishedFilter') === 'true',
			limit:
				searchParams.get('limit') === null ? undefined : Number(searchParams.get('limit')),
		};
		setAllFilters(filtersFromUrl);
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setIsInitialized(true);
	}, [searchParams, setAllFilters, setIsInitialized]);

	const currentPage = Number(searchParams.get('page')) || 1;

	const { data, isLoading, isError } = useLessonsQuery(
		getFetchLessonsParams(),
		currentPage,
		isInitialized,
	);

	const { totalPages } = { totalPages: data?.meta?.totalPages || 0 };

	const updateUrl = (params: URLSearchParams) => {
		const queryString = params.toString();
		router.push(`/lessons${queryString ? `?${queryString}` : ''}`, { scroll: false });
	};

	const handlePageChange = (page: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('page', String(page));
		updateUrl(params);
		scrollToTop();
	};

	const handleSearchClick = (mappedParams: FetchLessonsParams) => {
		const params = buildLessonFilterSearchParams(mappedParams);
		params.set('page', '1');
		updateUrl(params);
	};

	const handleResetAllFilters = () => {
		resetFilters();
		router.push('/lessons');
		scrollToTop();
	};

	return (
		<section className="container mx-auto py-8" aria-label="클래스 목록 페이지">
			<h1 className="text-3xl font-bold mb-6">클래스 목록</h1>

			<section aria-label="클래스 필터">
				<LessonFilterSection
					showCloseButton={false}
					onSearch={handleSearchClick}
					onReset={handleResetAllFilters}
				/>
			</section>

			<section className="my-8 flex justify-end" aria-label="정렬 옵션">
				<Select
					value={selectedSort || 'LATEST'}
					onValueChange={(value: string) => setSelectedSort(value as SortEnum)}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="정렬 기준" />
					</SelectTrigger>
					<SelectContent>
						{Object.entries(REVERSE_SORT_MAP).map(([backendValue, frontendName]) => (
							<SelectItem key={backendValue} value={backendValue as SortEnum}>
								{frontendName}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</section>

			<section className="my-8" aria-label="클래스 목록 결과">
				<LessonListDisplay
					lessons={data?.data || []}
					isLoading={isLoading}
					isError={isError}
					emptyMessage="조건에 맞는 클래스가 없습니다."
				/>
			</section>

			<section className="flex justify-center mt-8" aria-label="페이지네이션">
				<PaginationComponent
					page={currentPage}
					totalPages={totalPages}
					setPage={handlePageChange}
				/>
			</section>
		</section>
	);
}
