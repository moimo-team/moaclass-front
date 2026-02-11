import { useState, useEffect } from "react";
import { CouponCard } from "./CouponCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { CouponInfo } from "@/models/coupon.model";

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableCoupons: CouponInfo[];
  onApply: (coupon: CouponInfo) => void;
  selectedId?: number | null;
}

export const CouponModal = ({
  isOpen,
  onClose,
  availableCoupons = [],
  onApply,
  selectedId,
}: CouponModalProps) => {
  const [selectedCouponId, setSelectedCouponId] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedCouponId(selectedId || null);
    }
  }, [isOpen, selectedId]);

  const handleApply = () => {
    const selected = availableCoupons.find((c) => c.id === selectedCouponId);
    if (selected) {
      onApply(selected);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-xl border-none gap-0">
        <DialogHeader className="p-6 pb-4 flex flex-row items-center justify-between border-b bg-white">
          <DialogTitle className="text-lg font-bold">쿠폰</DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6 bg-slate-50/30">
          {/* Select Coupon Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-slate-700">
                적용할 쿠폰을 선택해 주세요
              </p>
              <p className="text-xs text-destructive">중복 적용 불가</p>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {availableCoupons.map((coupon) => (
                <CouponCard
                  key={coupon.id || 0}
                  coupon={coupon}
                  selected={selectedCouponId === coupon.id}
                  onClick={() => setSelectedCouponId(coupon.id || 0)}
                  showSelectionIndicator
                />
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 pt-2 border-t bg-white">
          <Button
            className="w-full h-12 text-base font-bold bg-[#F97316] hover:bg-[#EA580C] text-white rounded-lg shadow-lg shadow-orange-200 transition-all hover:translate-y-[-1px]"
            disabled={!selectedCouponId}
            onClick={handleApply}
          >
            쿠폰 적용하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
