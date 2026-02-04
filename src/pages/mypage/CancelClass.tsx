import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { OrderClassInfo } from "@/components/features/orderlist/orderDetail/OrderClassInfo";
import ActionButton from "@/components/common/ActionButton";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, CheckCircle2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { RefundRuleSection } from "@/components/features/pay/RefundRuleSection";

// Mock Data (Shared with OrderList for consistency)
const MOCK_ORDERS = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    className: `클래스명${i + 1}`,
    date: "2026.01.29(목)",
    startTime: "오후 12:00",
    endTime: "오후 15:00",
    status: i % 3 === 0 ? "예약완료" : i % 3 === 1 ? "예약취소" : "참석완료",
    imageUrl: `https://picsum.photos/seed/${i + 100}/200/120`,
    price: 33000,
}));

const CancelClass = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reason, setReason] = useState("단순 변심");
    const [detailReason, setDetailReason] = useState("");
    const [isAgreed, setIsAgreed] = useState(false);

    // Finding the order based on ID from URL
    const order = useMemo(() => {
        return MOCK_ORDERS.find(o => o.id === Number(id));
    }, [id]);

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-gray-500 mb-4">해당 주문 내역을 찾을 수 없습니다.</p>
                <ActionButton label="목록으로 돌아가기" onClick={() => navigate("/mypage/orderlist")} />
            </div>
        );
    }

    const reasons = ["단순 변심", "서비스 불만", "콘텐츠 불만", "기타"];

    return (
        <div className="max-w-3xl mx-auto w-full pb-20 bg-white min-h-screen font-nanum">
            {/* Header */}
            <header className="flex items-center p-4 border-b border-gray-100">
                <button onClick={() => navigate(-1)} className="mr-2 hover:bg-gray-50 p-1 rounded-full transition-colors">
                    <ChevronLeft className="w-6 h-6 text-gray-600" />
                </button>
                <h1 className="text-2xl font-bold text-[#2D3A3A]">수강 취소</h1>
            </header>

            <div className="p-5 space-y-8">
                {/* Class Info Section */}
                <section>
                    <h2 className="text-sm font-bold mb-3 text-gray-800">클래스 정보</h2>
                    <OrderClassInfo order={order as any} instructor="김요가 강사" />
                </section>

                {/* Refund Reason Section */}
                <section className="space-y-4">
                    <h2 className="text-sm font-bold text-gray-800">
                        환불 사유 <span className="text-destructive">(필수)</span>
                    </h2>
                    <div className="space-y-3">
                        {reasons.map((r) => (
                            <div
                                key={r}
                                className="flex items-center gap-3 cursor-pointer group"
                                onClick={() => setReason(r)}
                            >
                                <div className="relative flex items-center justify-center">
                                    {reason === r ? (
                                        <div className="w-5 h-5 rounded-full border-2 border-destructive flex items-center justify-center">
                                            <div className="w-2.5 h-2.5 rounded-full bg-destructive" />
                                        </div>
                                    ) : (
                                        <div className="w-5 h-5 rounded-full border-2 border-gray-200 group-hover:border-gray-300" />
                                    )}
                                </div>
                                <span className={reason === r ? "text-gray-900 font-medium" : "text-gray-600"}>
                                    {r}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Detailed Reason Section */}
                <section className="space-y-4">
                    <h2 className="text-sm font-bold text-gray-800">
                        상세 사유 <span className="text-destructive">(필수)</span>
                    </h2>
                    <Textarea
                        placeholder="환불 사유를 입력해 주세요. (예시: 콘텐츠가 생각한 것과 달라요.)"
                        className="min-h-[120px] resize-none border-gray-200 focus:border-primary/50 text-[15px]"
                        value={detailReason}
                        onChange={(e) => setDetailReason(e.target.value)}
                    />
                </section>

                <Separator className="bg-gray-100" />

                {/* Refund Guide Section */}
                <section className="space-y-6">
                    <h2 className="text-sm font-bold text-gray-800">환불 안내</h2>

                    {/* Payment Info */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-800">결제 금액</span>
                            <span className="font-bold text-gray-900">{(order.price || 0).toLocaleString()}원</span>
                        </div>
                        <div className="pl-4 space-y-2 text-sm text-gray-500">
                            <div className="flex justify-between">
                                <span>ㄴ 쿠폰</span>
                                <span>-</span>
                            </div>
                            <div className="flex justify-between">
                                <span>ㄴ 포인트</span>
                                <span>-</span>
                            </div>
                            <div className="flex justify-between font-medium">
                                <span>ㄴ 실 결제 금액</span>
                                <span>{(order.price || 0).toLocaleString()}원</span>
                            </div>
                        </div>
                    </div>

                    <Separator className="bg-gray-50" />

                    {/* Refund Info */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-800">환불 금액</span>
                            <span className="font-bold text-gray-900">{(order.price || 0).toLocaleString()}원</span>
                        </div>
                        <div className="pl-4 space-y-2 text-sm text-gray-500">
                            <div className="flex justify-between">
                                <span>ㄴ 쿠폰</span>
                                <span>-</span>
                            </div>
                            <div className="flex justify-between">
                                <span>ㄴ 포인트</span>
                                <span>-</span>
                            </div>
                            <div className="flex justify-between font-medium">
                                <span>ㄴ 실 환불 금액</span>
                                <span>{(order.price || 0).toLocaleString()}원</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 환불 규정 */}
                <section className="space-y-4">
                    <h2 className="text-sm font-bold text-gray-800">환불 규정</h2>
                    <RefundRuleSection />
                </section>

                {/* Agreement and Submit Section */}
                <section className="space-y-6 pt-4">
                    <div
                        className="flex items-center gap-2 cursor-pointer group"
                        onClick={() => setIsAgreed(!isAgreed)}
                    >
                        <div className="w-5 h-5 flex items-center justify-center">
                            {isAgreed ? (
                                <CheckCircle2 className="w-5 h-5 text-gray-900 fill-gray-900 stroke-white" />
                            ) : (
                                <div className="w-5 h-5 rounded border-2 border-gray-200 group-hover:border-gray-300 transition-colors" />
                            )}
                        </div>
                        <span className="text-sm text-gray-700 font-medium">환불 규정에 동의합니다.</span>
                    </div>

                    <ActionButton
                        label="환불 신청하기"
                        theme="destructive"
                        className="w-full h-14 text-base font-bold rounded-xl"
                        disabled={!isAgreed || !detailReason.trim()}
                        onClick={() => {
                            alert("환불 신청이 완료되었습니다.");
                            navigate("/mypage/orderlist");
                        }}
                    />
                </section>
            </div>
        </div>
    );
};

export default CancelClass;