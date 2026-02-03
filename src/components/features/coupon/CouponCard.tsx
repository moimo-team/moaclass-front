

export interface Coupon {
    id: string;
    name: string;
    discountLabel?: string;
    expiryDate: string;
    status?: '사용가능' | '기간만료' | '사용완료';
    type?: 'percentage' | 'amount' | 'PERCENT' | 'FIXED';
    amount?: number;
    discountValue?: number;
    discountType?: "PERCENT" | "FIXED";
}

interface CouponCardProps {
    coupon: Coupon;
    index?: number;
    selected?: boolean;
    onClick?: () => void;
    showSelectionIndicator?: boolean;
}

export const CouponCard = ({
    coupon,
    selected = false,
    onClick,
    showSelectionIndicator = false
}: CouponCardProps) => {
    const isAvailable = coupon.status === '사용가능' || !coupon.status;
    const type = coupon.type || coupon.discountType;
    const amount = coupon.amount ?? coupon.discountValue ?? 0;
    const isPercentage = type === 'percentage' || type === 'PERCENT';

    const displayAmount = isPercentage ? `${amount}%` : `${amount.toLocaleString()}원`;
    const displayLabel = coupon.discountLabel || (isPercentage ? `총 금액에서 ${amount}%` : `${amount.toLocaleString()}원 할인`);

    return (
        <div
            onClick={isAvailable ? onClick : undefined}
            className={`relative p-5 rounded-2xl border transition-all overflow-hidden group ${isAvailable
                ? `bg-white cursor-pointer shadow-sm ${selected
                    ? 'border-[#4f8f6a] ring-1 ring-[#4f8f6a]/20'
                    : 'border-gray-100 hover:border-[#6b8f71]/30'}`
                : 'bg-white opacity-40 grayscale pointer-events-none border-gray-100'
                }`}
        >
            <div className="flex flex-col h-full justify-between gap-4">
                <div className="space-y-1">
                    <div className="text-[11px] font-medium text-black/30">
                        {coupon.expiryDate} 까지
                    </div>
                    <h3 className={`text-[15px] font-bold leading-tight transition-colors ${isAvailable
                        ? `text-[#2f2f2f] group-hover:text-[#4f8f6a]`
                        : 'text-gray-400'
                        }`}>
                        {coupon.name}
                    </h3>
                </div>
                <div className="flex items-baseline justify-between mt-2">
                    <span className={`text-xs font-bold ${isAvailable ? 'text-black' : 'text-black/20'}`}>
                        {coupon.status || '사용가능'}
                    </span>
                    <div className="text-right">
                        <span className={`text-xl font-black ${isAvailable ? 'text-[#4f8f6a]' : 'text-gray-400'}`}>
                            {displayAmount}
                        </span>
                        <div className={`text-[11px] font-semibold mt-1 ${isAvailable ? 'text-black/50' : 'text-black/20'}`}>
                            {displayLabel}
                        </div>
                    </div>
                </div>
            </div>

            {/* 선택 표시기 */}
            {showSelectionIndicator && isAvailable && (
                <div className={`absolute top-4 right-4 h-5 w-5 rounded-full border-2 flex items-center justify-center ${selected ? 'border-[#4f8f6a] bg-[#4f8f6a]' : 'border-gray-200'
                    }`}>
                    {selected && <div className="h-2 w-2 rounded-full bg-white" />}
                </div>
            )}

            {/* 장식용 사이드 바 */}
            <div className={`absolute left-0 top-0 w-1.5 h-full ${isAvailable ? (selected ? 'bg-[#4f8f6a]' : 'bg-[#6b8f71]') : 'bg-gray-200'
                }`} />
        </div>
    );
};
