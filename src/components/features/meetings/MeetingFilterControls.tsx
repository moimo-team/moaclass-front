import type { FinishedFilterType, InterestFilterType, SortType } from '@/api/meeting.api';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { sortOptions } from '@/constants/sort';
import { cn } from '@/lib/utils';
import type { Interest } from '@/models/interest.model';

import { Skeleton } from '../../ui/skeleton'; // Import Skeleton component

interface MeetingFilterControlsProps {
	filters: {
		sort: SortType;
		interestFilter: InterestFilterType;
		finishedFilter: FinishedFilterType;
	};
	limit: number;
	interestsData: Interest[] | undefined;
	isInterestsLoading: boolean;
	handleSortChange: (newSort: SortType) => void;
	handleInterestFilterChange: (newInterest: InterestFilterType) => void;
	handleFinishedFilterChange: (checked: FinishedFilterType) => void;
	handleLimitChange: (newLimit: number) => void;
}

export const MeetingFilterControls = ({
	filters,
	limit,
	interestsData,
	isInterestsLoading,
	handleSortChange,
	handleInterestFilterChange,
	handleFinishedFilterChange,
	handleLimitChange,
}: MeetingFilterControlsProps) => {
	return (
		<div className="flex justify-between items-center px-4">
			<div className="flex items-center gap-2">
				{/* 카테고리 필터 */}
				<Select value={filters.interestFilter} onValueChange={handleInterestFilterChange}>
					<SelectTrigger className="w-[180px] bg-accent/50 text-foreground hover:bg-accent hover:text-primary transition-colors">
						<SelectValue placeholder="카테고리" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="ALL">전체</SelectItem>
						{isInterestsLoading ? (
							<>
								<SelectItem value="loading-1" disabled>
									<Skeleton className="h-5 w-[100px]" />
								</SelectItem>
								<SelectItem value="loading-2" disabled>
									<Skeleton className="h-5 w-[100px]" />
								</SelectItem>
								<SelectItem value="loading-3" disabled>
									<Skeleton className="h-5 w-[100px]" />
								</SelectItem>
							</>
						) : (
							interestsData?.map((interest) => (
								<SelectItem key={interest.id} value={interest.id.toString()}>
									{interest.name}
								</SelectItem>
							))
						)}
					</SelectContent>
				</Select>

				{/* 정렬 필터 */}
				<Select
					value={filters.sort}
					onValueChange={(value) => handleSortChange(value as SortType)}
				>
					<SelectTrigger className="w-[120px] bg-accent/50 text-foreground hover:bg-accent hover:text-primary transition-colors">
						<SelectValue placeholder="정렬" />
					</SelectTrigger>
					<SelectContent>
						{sortOptions.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{/* 모집 여부 필터 */}
				<Button
					variant="outline"
					onClick={() => handleFinishedFilterChange(!filters.finishedFilter)}
					className={cn(
						'min-w-[120px] transition-colors',
						!filters.finishedFilter
							? 'bg-accent/50 text-foreground border-primary/20 hover:bg-accent hover:text-primary'
							: 'border-primary/20 text-muted-foreground hover:bg-accent',
					)}
				>
					{filters.finishedFilter ? '전체 모임 보기' : '모집 중인 모임'}
				</Button>

				{/* 개수 버튼 */}
				<Select
					value={limit.toString()}
					onValueChange={(value) => handleLimitChange(Number(value))}
				>
					<SelectTrigger className="w-[110px] bg-accent/50 text-foreground hover:bg-accent hover:text-primary transition-colors">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="12">12개씩</SelectItem>
						<SelectItem value="24">24개씩</SelectItem>
						<SelectItem value="48">48개씩</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>
	);
};
