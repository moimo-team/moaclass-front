import { useState, useEffect } from "react";
import { Ticket } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Coupon {
    id: string;
    name: string;
    discountValue: number;
    discountType: "PERCENT" | "FIXED";
    expiryDate: string;
}

const MOCK_COUPONS: Coupon[] = [
    {
        id: "1",
        name: "[겨울방학 특가] 전 클래스 10% 할인 쿠폰",
        discountValue: 10,
        discountType: "PERCENT",
        expiryDate: "2026.02.28"
    },
    {
        id: "2",
        name: "모아클래스 첫 주문 감사 쿠폰",
        discountValue: 5000,
        discountType: "FIXED",
        expiryDate: "2026.12.31"
    },
];

interface CouponModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (coupon: Coupon) => void;
    selectedId?: string | null;
}

export const CouponModal = ({ isOpen, onClose, onApply, selectedId }: CouponModalProps) => {
    const [couponCode, setCouponCode] = useState("");
    const [selectedCouponId, setSelectedCouponId] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setSelectedCouponId(selectedId || null);
        }
    }, [isOpen, selectedId]);

    const handleApply = () => {
        const selected = MOCK_COUPONS.find(c => c.id === selectedCouponId);
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
                        <p className="text-sm font-semibold text-slate-700">적용할 쿠폰을 선택해 주세요</p>

                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                            {MOCK_COUPONS.map((coupon) => (
                                <div
                                    key={coupon.id}
                                    className={`relative group cursor-pointer transition-all duration-200 border-2 rounded-xl p-4 bg-white shadow-sm hover:shadow-md ${selectedCouponId === coupon.id
                                        ? "border-primary bg-primary/5 shadow-primary/10"
                                        : "border-slate-100 hover:border-slate-200"
                                        }`}
                                    onClick={() => setSelectedCouponId(coupon.id)}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-lg ${selectedCouponId === coupon.id ? "bg-primary text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                                            }`}>
                                            <Ticket className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-bold text-slate-800 line-clamp-1">{coupon.name}</h4>
                                                <Badge variant="secondary" className="bg-slate-100 text-slate-600 text-[10px] whitespace-nowrap ml-2">
                                                    {coupon.expiryDate} 까지
                                                </Badge>
                                            </div>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-xl font-black text-primary">
                                                    {coupon.discountType === "PERCENT"
                                                        ? `${coupon.discountValue}%`
                                                        : `${coupon.discountValue.toLocaleString()}원`}
                                                </span>
                                                <span className="text-xs font-medium text-slate-500">할인</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Selection indicator */}
                                    <div className={`absolute top-4 right-4 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedCouponId === coupon.id
                                        ? "border-primary bg-primary"
                                        : "border-slate-200"
                                        }`}>
                                        {selectedCouponId === coupon.id && (
                                            <div className="h-2 w-2 rounded-full bg-white" />
                                        )}
                                    </div>
                                </div>
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
