import type { CouponInfo } from "@/models/coupon.model";
import { formatFullDateTime } from "@/utils/dateFormat";

// export interface Coupon {
//     id: string;
//     name: string;
//     description?: string;
//     discountValue: number;
//     discountType: "PERCENT" | "FIXED";
//     expiryDate: string;
//     status?: string;
//     type?: string;
//     amount?: number;
//     discountLabel?: string;
// }

interface CouponCardProps {
  coupon?: CouponInfo;
  index?: number;
  selected?: boolean;
  onClick?: () => void;
  showSelectionIndicator?: boolean;
}

export const CouponCard = ({
  coupon,
  selected = false,
  onClick,
  showSelectionIndicator = false,
}: CouponCardProps) => {
  if (!coupon) return null;

  const isAvailable = coupon.status === "AVAILABLE" || !coupon.status; // Default to available if status is missing
  const isPercentage = coupon.discountType === "PERCENT";
  const discountValue = coupon.discountValue || 0;
  const displayAmount = isPercentage
    ? `${discountValue}%`
    : `${discountValue.toLocaleString()}원`;
  const displayLabel = isPercentage
    ? `총 금액에서 ${discountValue}%`
    : `${discountValue.toLocaleString()}원 할인`;

  return (
    <div
      onClick={isAvailable ? onClick : undefined}
      className={`relative p-5 rounded-xl border transition-all overflow-hidden group ${
        isAvailable
          ? `bg-white cursor-pointer shadow-sm ${
              selected
                ? "border-[#4f8f6a] ring-1 ring-[#4f8f6a]/20"
                : "border-slate-200 hover:border-[#4f8f6a]/30"
            }`
          : "bg-slate-50 opacity-60 grayscale pointer-events-none border-slate-200"
      }`}
    >
      {/* 장식용 사이드 바 */}
      <div
        className={`absolute left-0 top-0 w-1.5 h-full ${
          isAvailable
            ? selected
              ? "bg-[#4f8f6a]"
              : "bg-[#6b8f71]"
            : "bg-slate-300"
        }`}
      />

      {/* 선택 표시기 (우측 상단) */}
      {showSelectionIndicator && isAvailable && (
        <div
          className={`absolute top-4 right-4 h-5 w-5 rounded-full border flex items-center justify-center transition-colors ${
            selected ? "border-[#4f8f6a] bg-[#4f8f6a]" : "border-slate-300"
          }`}
        >
          {selected && <div className="h-2 w-2 rounded-full bg-white" />}
        </div>
      )}

      <div className="flex flex-col h-full justify-between gap-3 pl-2">
        <div className="space-y-1">
          <div className="text-[12px] text-slate-400 font-medium">
            {formatFullDateTime(coupon.validUntil || "")} 까지
          </div>
          <h3
            className={`text-[15px] font-bold leading-tight break-keep pr-8 ${
              isAvailable ? "text-slate-800" : "text-slate-400"
            }`}
          >
            {coupon.name}
          </h3>
        </div>

        <div className="flex items-end justify-between mt-1">
          <span
            className={`text-[13px] font-bold ${isAvailable ? "text-slate-800" : "text-slate-400"}`}
          >
            사용가능
          </span>

          <div className="text-right">
            <div
              className={`text-2xl font-bold tracking-tight ${isAvailable ? "text-[#4f8f6a]" : "text-slate-400"}`}
            >
              {displayAmount}
            </div>
            <div
              className={`text-[11px] font-medium ${isAvailable ? "text-slate-500" : "text-slate-400"}`}
            >
              {displayLabel}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
