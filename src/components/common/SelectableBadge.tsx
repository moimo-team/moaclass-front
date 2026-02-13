import { X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SelectableBadgeProps {
	label: string;
	isSelected: boolean;
	onClick: () => void;
	size?: 'sm' | 'md' | 'lg';
	variant?: 'badge' | 'card';
	className?: string;
}

/**
 * 선택 가능한 뱃지/카드 컴포넌트
 * - variant="badge": 기존 뱃지 스타일 (대분류/소분류용)
 * - variant="card": UserInfo/UserProfileModal용 그리드 아이템 스타일
 * - size: sm, md, lg (lg는 card variant의 기본값)
 */
export function SelectableBadge({
	label,
	isSelected,
	onClick,
	size = 'md',
	variant = 'badge',
	className,
}: SelectableBadgeProps) {
	if (variant === 'card') {
		return (
			<button
				type="button"
				onClick={onClick}
				className={cn(
					'w-full h-12 rounded-[8px] text-sm font-medium transition-all duration-200 border-none shadow-sm',
					isSelected
						? 'bg-primary text-white shadow-md transform scale-[0.98]'
						: 'bg-secondary/40 text-foreground hover:bg-secondary/60',
					className,
				)}
			>
				{label}
			</button>
		);
	}

	return (
		<Badge
			variant={isSelected ? 'default' : 'outline'}
			className={cn(
				'cursor-pointer transition-colors',
				size === 'md'
					? 'px-4 py-2 text-sm'
					: size === 'sm'
						? 'px-3 py-1.5 text-xs'
						: 'px-5 py-2.5 text-base',
				isSelected
					? 'bg-primary text-primary-foreground hover:bg-primary/90'
					: 'hover:bg-secondary',
				className,
			)}
			onClick={onClick}
		>
			{label}
			{isSelected && <X className={cn('ml-1', size === 'md' ? 'h-3 w-3' : 'h-2.5 w-2.5')} />}
		</Badge>
	);
}
