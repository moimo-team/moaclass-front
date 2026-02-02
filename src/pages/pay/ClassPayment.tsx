import { useState } from "react";
import { ChevronLeft, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaySectionCard } from "@/components/features/pay/PaySectionCard";
import { TicketSection } from "@/components/features/pay/TicketSection";
import { ContactSection } from "@/components/features/pay/ContactSection";
import { PayInfoSection } from "@/components/features/pay/PayInfoSection";

// Mock Data
const MOCK_DATA = {
    classInfo: {
        name: "나만의 모우인형, 귀염뽀짝 모우키링 만들기",
        date: "2026.01.20 19:00",
        location: "대한민국 서울특별시 강남구 논현로152길 37",
        thumbnailUrl: "https://picsum.photos/id/111/300/300",
    },
    userInfo: {
        email: "7777@naver.com",
        nickname: "김세븐",
    },
    paymentInfo: {
        ticketTitle: "원데이 클래스 수강권",
        pricePerUnit: 20610,
        quantity: 2,
        availableCoupons: 0,
        availableCredit: 0,
    }
};

const ClassPayment = () => {
    const [isCancelOpen, setIsCancelOpen] = useState(true);
    const [isGuideOpen, setIsGuideOpen] = useState(true);
    const [creditToUse, setCreditToUse] = useState("0");

    const { classInfo, userInfo, paymentInfo } = MOCK_DATA;
    const subTotal = paymentInfo.pricePerUnit * paymentInfo.quantity;
    const totalPayment = subTotal - parseInt(creditToUse || "0", 10);

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-6 pb-20">
            {/* Header */}
            <header className="flex items-center gap-2 mb-6">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-xl font-bold">클래스 결제 페이지</h1>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Left Column */}
                <div className="space-y-6">
                    {/* Class Ticket Info */}
                    <TicketSection classInfo={classInfo} />

                    {/* Contact Info */}
                    <ContactSection userInfo={userInfo} />
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Cancellation & Refund Guide */}
                    <PaySectionCard
                        title="취소 및 환불 안내"
                        extra={
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 hover:bg-transparent"
                                onClick={() => setIsCancelOpen(!isCancelOpen)}
                            >
                                {isCancelOpen ? <ChevronUp className="h-4 w-4 text-primary" /> : <ChevronDown className="h-4 w-4 text-primary" />}
                            </Button>
                        }
                    >
                        {isCancelOpen && (
                            <div className="space-y-4 text-xs">
                                <p className="font-bold">1. 날짜 별 취소 및 환불 정책</p>
                                <div className="border rounded-sm overflow-hidden border-border/60">
                                    <table className="w-full text-left border-collapse">
                                        <tbody className="divide-y divide-border/60 text-[11px]">
                                            <tr className="bg-muted/20">
                                                <td className="p-2 border-r border-border/60 w-1/2">결제 후 1시간 이내 취소</td>
                                                <td className="p-2 text-primary font-semibold text-center">100% 환불</td>
                                            </tr>
                                            <tr>
                                                <td className="p-2 border-r border-border/60">클래스 4일 이전 취소</td>
                                                <td className="p-2 text-primary font-semibold text-center">100% 환불</td>
                                            </tr>
                                            <tr>
                                                <td className="p-2 border-r border-border/60">클래스 3일 전 취소</td>
                                                <td className="p-2 text-center">70% 환불</td>
                                            </tr>
                                            <tr>
                                                <td className="p-2 border-r border-border/60">클래스 2일 전 취소</td>
                                                <td className="p-2 text-center">50% 환불</td>
                                            </tr>
                                            <tr>
                                                <td className="p-2 border-r border-border/60">클래스 하루 전 또는 당일 취소</td>
                                                <td className="p-2 text-destructive font-semibold text-center">환불 불가</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <p className="font-bold">2. 취소 방법</p>
                                <p className="text-muted-foreground leading-relaxed">
                                    클래스 결제/예약 내역 페이지에서 취소하고자 하시는 클래스 티켓의
                                    <span className="text-destructive font-semibold mx-1">수강 취소</span>
                                    버튼을 클릭하시면 취소 신청이 완료됩니다.
                                </p>
                            </div>
                        )}
                    </PaySectionCard>

                    {/* Payment Guide */}
                    <PaySectionCard
                        title="결제 안내"
                        extra={
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 hover:bg-transparent"
                                onClick={() => setIsGuideOpen(!isGuideOpen)}
                            >
                                {isGuideOpen ? <ChevronUp className="h-4 w-4 text-primary" /> : <ChevronDown className="h-4 w-4 text-primary" />}
                            </Button>
                        }
                    >
                        {isGuideOpen && (
                            <ul className="space-y-2 text-xs text-muted-foreground list-disc pl-4 leading-relaxed">
                                <li>개설된 클래스 일정이 없는 경우, 문의를 통해 개설 요청을 드릴 수 있어요.</li>
                                <li>결제 완료 시 온라인 티켓이 발행되며, <span className="text-destructive/80 font-medium">클래스 결제/예약 내역</span> 페이지를 통해 티켓을 확인 하실 수 있습니다. 그리고 등록해주신 이메일로 클래스 정보를 포함한 안내문이 발송됩니다.</li>
                            </ul>
                        )}
                    </PaySectionCard>

                    {/* Payment Info */}
                    <PayInfoSection
                        paymentInfo={paymentInfo}
                        creditToUse={creditToUse}
                        setCreditToUse={setCreditToUse}
                        subTotal={subTotal}
                        totalPayment={totalPayment}
                    />
                </div>
            </div>
        </div>
    );
};

export default ClassPayment;
