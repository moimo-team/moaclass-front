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
	/* const selectedSort = useFilterStore((state) => state.selectedSort); */
	const setSelectedSort = useFilterStore((state) => state.setSelectedSort);

	useEffect(() => {
		const categoryIds = parseMultiValueParam(searchParams, 'categoryId');
		const subCategoryIds = parseMultiValueParam(searchParams, 'subCategoryId');
		const statusValues = parseMultiValueParam(searchParams, 'status');
		const dayValues = parseMultiValueParam(searchParams, 'days');
		const levelValues = parseMultiValueParam(searchParams, 'level');

		const filtersFromUrl: Partial<FilterState> = {
			selectedCategories: [],
			selectedMainCategory: null,
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
	}, [searchParams, setAllFilters]);

	const currentPage = Number(searchParams.get('page')) || 1;

	const { data, isLoading, isError } = useLessonsQuery(
		getFetchLessonsParams(),
		currentPage,
		isInitialized,
	);

	const { totalPages } = { totalPages: data?.meta?.totalPages || 0 };

	const handlePageChange = (page: number) => {
		const nextSearchParams = new URLSearchParams(searchParams.toString());
		nextSearchParams.set('page', String(page));
		setSearchParams(nextSearchParams);
		scrollToTop();
	};

	const handleSearchClick = (mappedParams: FetchLessonsParams) => {
		const params = buildLessonFilterSearchParams(mappedParams);
		params.set('page', '1'); // 검색 시 페이지 1로 초기화
		setSearchParams(params);
	};

	const handleResetAllFilters = () => {
		resetFilters();
		setSearchParams({});
		scrollToTop();
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
				<Select onValueChange={(value: string) => setSelectedSort(value as SortEnum)}>
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
