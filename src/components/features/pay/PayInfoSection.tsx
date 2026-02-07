import { useState } from 'react';
import { X } from 'lucide-react';
import { PaySectionCard } from './PaySectionCard';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { CouponModal } from '../coupon/CouponModal';
import type { CouponInfo, userCoupons } from '@/models/coupon.model';
import { useAvailableCouponsQuery } from '@/hooks/useCouponQuery';

interface PayInfoSectionProps {
  lesson: {
    title: string;
    discountedPrice: number;
  };
  price: {
    quantity: number;
    subtotal: number;
    total: number;
  };
  availableCouponCnt: number;
  availablePoints: number;
  pointToUse: number;
  setPointToUse: (value: number) => void;
  subTotal: number;
  totalPayment: number;
}

export const PayInfoSection = ({
  lesson,
  price,
  availableCouponCnt,
  availablePoints,
  pointToUse,
  setPointToUse,
  subTotal,
  totalPayment
}: PayInfoSectionProps) => {
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponInfo | null>(null);
  const { data: availableCoupons } = useAvailableCouponsQuery(1);

  const handleApplyCoupon = (coupon: CouponInfo) => {
    setAppliedCoupon(coupon);
  };

  return (
    <PaySectionCard title="결제 정보">
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span>{lesson.title} {price.quantity}매</span>
            <span>{lesson.discountedPrice.toLocaleString()} 원</span>
          </div>
          <div className="text-right text-[11px] text-muted-foreground">
            x {price.quantity}명
          </div>
          <div className="flex justify-between items-center text-sm font-bold pt-1">
            <span>소계</span>
            <span>{subTotal.toLocaleString()} 원</span>
          </div>
        </div>

        <Separator className="bg-border/60" />

        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold text-xs">쿠폰</span>
            <span className="text-[10px] text-primary">사용 가능 쿠폰 : {availableCouponCnt}개</span>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 relative group">
              <Input
                disabled
                placeholder={appliedCoupon ? appliedCoupon.description : "쿠폰을 선택해주세요"}
                className={`h-10 rounded-sm border-border/60 ${appliedCoupon ? "bg-white text-primary font-medium pr-8" : "bg-muted/20"}`}
              />
              {appliedCoupon && (
                <button
                  onClick={() => setAppliedCoupon(null)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button
              className="text-sm bg-slate-800 text-white hover:bg-slate-700 rounded-sm"
              onClick={() => setIsCouponModalOpen(true)}
            >
              {appliedCoupon ? "변경" : "쿠폰 적용"}
            </Button>
          </div>
        </div>

        <CouponModal
          isOpen={isCouponModalOpen}
          onClose={() => setIsCouponModalOpen(false)}
          onApply={handleApplyCoupon}
          selectedId={appliedCoupon?.id}
          availableCoupons={availableCoupons || []} // API에서 불러온 쿠폰 목록 전달
        />

        <Separator className="bg-border/60" />

        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold text-xs">포인트</span>
            <span className="text-[10px] text-primary">보유 : {(availablePoints - pointToUse).toLocaleString()}원</span>
          </div>
          <div className="flex gap-2">
            <Input
              type="text"
              className="text-right h-10 rounded-sm border-border/60"
              value={pointToUse}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (!isNaN(value) && value >= 0 && value <= availablePoints && value <= totalPayment) {
                  setPointToUse(value);
                }
              }}
            />
            <Button
              className="text-sm bg-slate-800 text-white hover:bg-slate-700 rounded-sm"
              onClick={() => {
                const maxPoints = Math.min(availablePoints, totalPayment);
                setPointToUse(maxPoints);
              }}
            >
              전체 사용
            </Button>
          </div>
        </div>

        <Separator className="bg-border/60" />

        <div className="flex justify-between items-end pb-2">
          <span className="text-sm font-bold">총 결제 금액</span>
          <span className="text-xl font-black text-foreground">{(totalPayment - pointToUse).toLocaleString()} 원</span>
        </div>

        <Button className="w-full h-11 text-base font-bold bg-carrot hover:bg-carrot-hover text-white rounded-md">
          결제 하기
        </Button>
      </div>
    </PaySectionCard>
  );
};
