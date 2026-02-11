import { useState, useMemo } from "react";
import { X } from "lucide-react";
import { PaySectionCard } from "./PaySectionCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { CouponModal } from "../coupon/CouponModal";
import type { CouponInfo } from "@/models/coupon.model";
import { usePayMutation } from "@/hooks/usePayMutations";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import type { PayPreviewResponse } from "@/models/pay.model";
import { FormInput } from "../modal/components/FormInput";
import { usePayCalculation } from "@/hooks/usePayQuery";

interface PayInfoSectionProps {
  payPreview: PayPreviewResponse;
  scheduleId: number;
  userId: number;
}

export const PayInfoSection = ({
  payPreview,
  scheduleId,
  userId,
}: PayInfoSectionProps) => {
  const {
    lesson,
    originalPrice,
    quantity,
    subtotal,
    availableCoupons,
    userPoints,
    canPay: initialCanPay,
  } = payPreview;
  const navigate = useNavigate();
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponInfo | null>(null);

  const { mutateAsync: createPayment } = usePayMutation();

  // 쿠폰 계산 데이터 메모이제이션
  const calculationParams = useMemo(() => {
    if (!appliedCoupon) return null;
    return {
      scheduleId,
      quantity,
      couponId: appliedCoupon.id!,
    };
  }, [appliedCoupon, scheduleId, quantity]);

  // 쿠폰 적용 시 실시간 계산 조회
  const { data: calculationResult } = usePayCalculation(calculationParams);

  const handleApplyCoupon = (coupon: CouponInfo) => {
    setAppliedCoupon(coupon);
  };

  // 서버에서 계산된 값 우선 사용, 쿠폰 없을 시 초기값 사용
  const discountAmount = appliedCoupon
    ? (calculationResult?.couponDiscount ?? 0)
    : 0;
  const finalPrice = appliedCoupon
    ? (calculationResult?.finalPrice ?? subtotal)
    : subtotal;
  const canPay = appliedCoupon
    ? (calculationResult?.canPay ?? initialCanPay)
    : initialCanPay;

  // 결제하기
  const handlePay = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!userId) {
      toast.error("로그인이 필요한 서비스입니다.");
      return;
    }

    try {
      await createPayment({
        scheduleId,
        amount: finalPrice,
        couponId: appliedCoupon?.id || null,
      });
      toast.success("결제가 완료되었습니다.");
      navigate("/mypage/class/orders", { replace: true });
    } catch (error) {
      console.error("handlePay error:", error);
      toast.error("결제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <PaySectionCard title="결제 정보">
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span>
              {lesson.title} {quantity}매
            </span>
            <span>{originalPrice.toLocaleString()} 원</span>
          </div>
          <div className="text-right text-[11px] text-muted-foreground">
            x {quantity}명
          </div>
          <div className="flex justify-between items-center text-sm font-bold pt-1">
            <span>소계</span>
            <span>{subtotal.toLocaleString()} 원</span>
          </div>
        </div>

        <Separator className="bg-border/60" />

        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold text-xs">쿠폰</span>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-primary">
                사용 가능 쿠폰 : {availableCoupons.length}개
              </span>
              {discountAmount > 0 && (
                <span className="text-[10px] text-blue-600 font-bold">
                  -{discountAmount.toLocaleString()}원 할인 적용 중
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 relative group">
              <Input
                disabled
                placeholder={
                  appliedCoupon ? appliedCoupon.name : "쿠폰을 선택해주세요"
                }
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
          // availableCoupons={userCoupons || []} // API에서 불러온 쿠폰 목록 전달
          availableCoupons={availableCoupons || []}
        />

        <Separator className="bg-border/60" />

        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold text-xs">포인트 보유 현황</span>
            <span className="text-[14px] text-red-500">
              {!canPay ? "포인트 잔액이 부족합니다" : ""}
            </span>
          </div>
          <div className="flex gap-2">
            <FormInput
              id="userPoints"
              value={userPoints}
              readOnly
              suffix="원"
              className="text-right"
            />
          </div>
        </div>

        <Separator className="bg-border/60" />

        <div className="space-y-1 pb-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">총 상품금액</span>
            <span>{subtotal.toLocaleString()} 원</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-blue-600">쿠폰 할인</span>
              <span className="text-blue-600">
                -{discountAmount.toLocaleString()} 원
              </span>
            </div>
          )}
          <div className="flex justify-between items-end pt-2 border-t mt-2">
            <span className="text-sm font-bold">총 결제 금액</span>
            <span className="text-xl font-black text-foreground">
              {Math.max(0, finalPrice).toLocaleString()} 원
            </span>
          </div>

          <Button
            variant="carrot"
            size="carrot"
            className="w-full"
            type="button"
            disabled={!canPay}
            onClick={handlePay}
          >
            {canPay ? "결제하기" : "포인트 잔액 부족"}
          </Button>
        </div>
      </div>
    </PaySectionCard>
  );
};
