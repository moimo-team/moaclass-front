import { cn } from "@/lib/utils";

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
    <div className={cn("flex flex-col gap-2", className)}>
      {showDate && createdAt && (
        <p className="text-xs text-muted-foreground">
          {createdAt}
        </p>
      )}

      <div className="flex items-start justify-between gap-2">
        <h3 className={cn(
          "font-nanum-bold text-base line-clamp-1 break-all flex-1 text-gray-900",
          titleClassName
        )}>
          {title}
        </h3>
        <span className="inline-block px-2 py-1 text-sm text-primary bg-secondary/20 border border-secondary rounded whitespace-nowrap flex-shrink-0">
          {category}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {discountRate > 0 && (
          <span className="text-sm font-bold text-red-500">
            {discountRate}%
          </span>
        )}
        <div className="flex items-baseline gap-1.5 font-nanum-bold">
          <span className="text-base text-gray-900">
            {discountedPrice.toLocaleString()}원
          </span>
          {discountRate > 0 && (
            <span className="text-xs text-gray-400 line-through font-normal">
              {price.toLocaleString()}원
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
