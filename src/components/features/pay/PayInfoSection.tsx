import { PaySectionCard } from './PaySectionCard';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

interface PayInfoSectionProps {
    paymentInfo: {
        ticketTitle: string;
        pricePerUnit: number;
        quantity: number;
        availableCoupons: number;
        availableCredit: number;
    };
    creditToUse: string;
    setCreditToUse: (value: string) => void;
    subTotal: number;
    totalPayment: number;
}

export const PayInfoSection = ({
    paymentInfo,
    creditToUse,
    setCreditToUse,
    subTotal,
    totalPayment
}: PayInfoSectionProps) => {
    return (
        <PaySectionCard title="결제 정보">
            <div className="space-y-4">
                <div className="space-y-1">
                    <div className="flex justify-between items-center text-sm font-semibold">
                        <span>{paymentInfo.ticketTitle} {paymentInfo.quantity}매</span>
                        <span>{paymentInfo.pricePerUnit.toLocaleString()} 원</span>
                    </div>
                    <div className="text-right text-[11px] text-muted-foreground">
                        x {paymentInfo.quantity}명
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
                        <span className="text-[10px] text-primary">사용 가능 쿠폰 : {paymentInfo.availableCoupons}개</span>
                    </div>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <Input
                                disabled
                                placeholder="쿠폰을 선택해주세요"
                                className="h-10 rounded-sm border-border/60 bg-muted/20"
                            />
                        </div>
                        <Button className="text-sm bg-slate-800 text-white hover:bg-slate-700 rounded-sm">
                            쿠폰 적용
                        </Button>
                    </div>
                </div>

                <Separator className="bg-border/60" />

                <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-xs">크레딧</span>
                        <span className="text-[10px] text-primary">보유 : {paymentInfo.availableCredit.toLocaleString()}원</span>
                    </div>
                    <div className="flex gap-2">
                        <Input
                            type="text"
                            className="text-right h-10 rounded-sm border-border/60"
                            value={creditToUse}
                            onChange={(e) => setCreditToUse(e.target.value)}
                        />
                        <Button
                            className="text-sm bg-slate-800 text-white hover:bg-slate-700 rounded-sm"
                            onClick={() => setCreditToUse(paymentInfo.availableCredit.toString())}
                        >
                            전체 사용
                        </Button>
                    </div>
                </div>

                <Separator className="bg-border/60" />

                <div className="flex justify-between items-end pb-2">
                    <span className="text-sm font-bold">총 결제 금액</span>
                    <span className="text-xl font-black text-foreground">{totalPayment.toLocaleString()} 원</span>
                </div>

                <Button className="w-full h-11 text-base font-bold bg-[#F97316] hover:bg-[#EA580C] text-white rounded-md">
                    결제 하기
                </Button>
            </div>
        </PaySectionCard>
    );
};
