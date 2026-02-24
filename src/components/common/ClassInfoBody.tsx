import { cn } from '@/lib/utils';

interface ClassInfoBodyProps {
	title: string;
	category: string;
	price: number;
	discountRate: number;
	discountedPrice: number;
	createdAt?: string;
	showDate?: boolean;
	className?: string;
	titleClassName?: string;
}

/**
 * 클래스 카드에서 공통적으로 사용되는 본문 정보 컴포넌트
 * - 제목, 카테고리, 가격, 할인율 등을 포함
 * - 메인 페이지 클래스 목록, 관리 페이지 등에서 공통 사용
 */
export function ClassInfoBody({
	title,
	category,
	price,
	discountRate,
	discountedPrice,
	createdAt,
	showDate = true,
	className,
	titleClassName,
}: ClassInfoBodyProps) {
	return (
		<div className={cn('flex flex-col gap-2', className)}>
			{showDate && createdAt && (
				<p className="text-[11px] text-muted-foreground">{createdAt}</p>
			)}

			<div className="flex items-start justify-between gap-2">
				<h3
					className={cn(
						'font-nanum-bold text-base leading-tight text-gray-900 break-words flex-1 overflow-hidden',
						titleClassName || 'line-clamp-1',
					)}
				>
					{title}
				</h3>
				<span className="inline-block px-2 py-1 text-sm text-primary bg-secondary/20 border border-secondary rounded whitespace-nowrap flex-shrink-0">
					{category}
				</span>
			</div>

			<div className="flex items-end gap-2 h-14">
				{discountRate > 0 ? (
					<span className="text-primary font-bold text-lg mb-0.5">{discountRate}%</span>
				) : (
					<div className="w-0" />
				)}
				<div className="flex flex-col justify-end h-full py-0.5">
					{discountRate > 0 ? (
						<span className="text-[10px] text-gray-400 line-through mb-[-3px] font-normal">
							{price.toLocaleString()}원
						</span>
					) : (
						<div className="h-[13px]" />
					)}
					<span className="text-lg font-bold text-gray-900 leading-tight">
						{discountedPrice.toLocaleString()}원
					</span>
				</div>
			</div>
		</div>
	);
}
