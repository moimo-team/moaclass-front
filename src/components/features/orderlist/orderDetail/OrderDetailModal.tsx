import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Order } from "../OrderClassCard";

interface OrderDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order | null;
}

const OrderDetailModal = ({ isOpen, onClose, order }: OrderDetailModalProps) => {
    if (!order) return null;

    const isCanceled = order.status === "예약취소";

    // 모달을 위해 필요한 추가 데이터 (실제 데이터 연동 시에는 API에서 받아올 정보들)
    const mockDetail = {
        orderNumber: "12414324",
        instructor: "강사명",
        price: 33000,
        discount: 8250,
        totalPrice: 24750,
        paymentTime: "2025. 08. 04. 16:04 (Asia/Seoul)",
        cancelReason: "개인 사정으로 인한 취소",
        detailReason: "갑작스러운 일정 변경으로 인해 수강이 어렵게 되었습니다. 다음에 꼭 다시 신청하겠습니다.",
        refundAmount: 24750,
        deductionAmount: 8250,
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md p-6 rounded-[24px]">
                <DialogHeader className="space-y-1 mb-4">
                    <DialogTitle className="text-xl font-bold text-[#2D3A3A]">결제 내역 상세</DialogTitle>
                    <p className="text-muted-foreground text-sm">주문번호 : {mockDetail.orderNumber}</p>
                </DialogHeader>

                <div className="space-y-4">
                    {/* 클래스 정보 섹션 */}
                    <div className="border border-[#4A5D4A] rounded-[16px] p-5 space-y-1">
                        <h3 className="font-bold text-lg text-[#2D3A3A]">{order.className}</h3>
                        <p className="text-muted-foreground">{mockDetail.instructor}</p>
                        <p className="text-[#2D3A3A] font-medium">{order.price?.toLocaleString() || mockDetail.price.toLocaleString()}원</p>
                    </div>

                    {/* 수강취소사유 (조건부) - 개선된 디자인 */}
                    {isCanceled && (
                        <div className="border border-[#4A5D4A] rounded-[16px] p-5 space-y-2 bg-[#FDFEFC]">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-[#4A5D4A]">수강취소사유</span>
                                <Badge variant="outline" className="text-[10px] h-5 border-[#4A5D4A] text-[#4A5D4A]">
                                    {mockDetail.cancelReason}
                                </Badge>
                            </div>
                            <p className="text-[#667085] text-sm leading-relaxed bg-white/50 p-3 rounded-lg border border-dashed border-[#4A5D4A]/20">
                                {mockDetail.detailReason}
                            </p>
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* 결제 금액 요약 섹션 */}
                        <div className="bg-[#F8F9F8] rounded-[20px] p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-[#2D3A3A]">총 결제 금액</span>
                                <span className="font-bold text-xl text-[#2D3A3A]">{mockDetail.totalPrice.toLocaleString()}원</span>
                            </div>

                            <div className="space-y-2 text-sm text-muted-foreground pt-2 border-t border-gray-100">
                                <div className="flex justify-between">
                                    <span>강의 금액</span>
                                    <span>{mockDetail.price.toLocaleString()}원</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>할인 금액</span>
                                    <span className="text-gray-400">-{mockDetail.discount.toLocaleString()}원</span>
                                </div>
                            </div>
                        </div>

                        {/* 환불 금액 요약 섹션 (조건부) */}
                        {isCanceled && (
                            <div className="bg-[#F8F9F8] rounded-[20px] p-6 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-[#2D3A3A]">총 환불 금액</span>
                                    <span className="font-bold text-xl text-[#2D3A3A]">{mockDetail.refundAmount.toLocaleString()}원</span>
                                </div>

                                <div className="space-y-2 text-sm text-muted-foreground pt-2 border-t border-gray-100">
                                    <div className="flex justify-between">
                                        <span>강의 금액</span>
                                        <span>{mockDetail.price.toLocaleString()}원</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-[#2D3A3A]">차감 금액</span>
                                        <span className="text-gray-400">-{mockDetail.deductionAmount.toLocaleString()}원</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 하단 상세 정보 - 스타일 통일 (회색 박스) */}
                        <div className="bg-[#F8F9F8] rounded-[20px] p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-500">상태</span>
                                <Badge variant="default" className={cn(
                                    "font-medium px-2 py-0.5 rounded-[4px] text-[11px]"
                                )}>
                                    {isCanceled ? "결제 취소" : "결제 완료"}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 font-medium">{isCanceled ? "환불 시각" : "결제 시각"}</span>
                                <span className="text-[#2D3A3A] font-bold">{mockDetail.paymentTime}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default OrderDetailModal;
