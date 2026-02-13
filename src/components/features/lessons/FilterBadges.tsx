import { X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

interface FilterBadgesProps {
	regions: string[];
	categories: string[];
	onRemoveRegion: (region: string) => void;
	onRemoveCategory: (category: string) => void;
}

// 내부용 단일 배지 컴포넌트 (접근성 + 스타일 통일)
const FilterBadgeItem = ({
	label,
	onRemove,
	variant = 'default',
}: {
	label: string;
	onRemove: () => void;
	variant?: 'default' | 'secondary';
}) => (
	<Badge variant={variant} className="flex items-center gap-1 pr-1 pl-2 py-1">
		{label}
		<button
			type="button"
			onClick={onRemove}
			className="ml-1 rounded-full p-0.5 hover:bg-black/10 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
			aria-label={`${label} 필터 삭제`}
		>
			<X className="h-3 w-3" />
		</button>
	</Badge>
);

export const FilterBadges = ({
	regions,
	categories,
	onRemoveRegion,
	onRemoveCategory,
}: FilterBadgesProps) => {
	const hasFilters = regions.length > 0 || categories.length > 0;

	return (
		<div className="flex flex-wrap items-center gap-2 mb-6 p-4 border rounded-md bg-gray-50 min-h-[50px]">
			{regions.map((region) => (
				<FilterBadgeItem
					key={`region-${region}`} // Key 중복 방지
					label={region}
					onRemove={() => onRemoveRegion(region)}
					variant="default"
				/>
			))}

			{categories.map((category) => (
				<FilterBadgeItem
					key={`cat-${category}`}
					label={category}
					onRemove={() => onRemoveCategory(category)}
					variant="secondary"
				/>
			))}

			{!hasFilters && (
				<span className="text-sm text-gray-500 pl-1">선택된 필터가 없습니다.</span>
			)}
		</div>
	);
};
