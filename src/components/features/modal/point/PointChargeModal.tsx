import { useState, useEffect } from "react";
import ConfirmDialog from "@/components/features/modal/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { FormInput } from "../components/FormInput";

interface PointChargeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCharge?: (amount: number) => void;
}

const QUICK_AMOUNTS = [1000, 5000, 10000, 50000];

export const PointChargeModal = ({
  open,
  onOpenChange,
  onCharge,
}: PointChargeModalProps) => {
  const [amount, setAmount] = useState<number>(0);

  useEffect(() => {
    if (open) {
      setAmount(0);
    }
  }, [open]);

  const handleAmountSelect = (val: number) => {
    setAmount((prev) => prev + val);
  };

  const handleConfirm = () => {
    if (amount <= 0) return;
    if (onCharge) {
      onCharge(amount);
    }
    setAmount(0);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setAmount(0);
    onOpenChange(false);
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) setAmount(0);
        onOpenChange(isOpen);
      }}
      title="포인트 충전"
      confirmText="충전"
      cancelText="취소"
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    >
      <div className="flex flex-col gap-6 py-4 px-6 border-t border-b border-gray-100">
        <div className="flex flex-wrap gap-2">
          {QUICK_AMOUNTS.map((amt) => (
            <Button
              key={amt}
              variant="outline"
              onClick={() => handleAmountSelect(amt)}
              className="h-8 px-4 rounded-lg text-sm font-bold transition-colors bg-[#dfece3] text-[#6b8f71] border-none hover:bg-[#d0e0d5]"
            >
              {amt.toLocaleString()}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-[#2f2f2f] whitespace-nowrap">
            충전금액:
          </span>
          <FormInput
            id="charge-amount"
            value={amount}
            readOnly
            suffix="원"
            className="text-right pr-4"
          />
        </div>
      </div>
    </ConfirmDialog>
  );
};
