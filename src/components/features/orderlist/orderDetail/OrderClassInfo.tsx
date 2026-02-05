import type { Order } from "@/components/features/orderlist/OrderClassCard";

interface OrderClassInfoProps {
    order: Order;
    instructor?: string;
}

export const OrderClassInfo = ({ order, instructor = "강사명" }: OrderClassInfoProps) => {
    // 내부적으로 사용하는 원본 가격 (프롭으로 전달되지 않았을 경우를 대비한 대체값)
    const basePrice = 33000;

    return (
        <div className="border border-[#4A5D4A] rounded-[16px] p-5 space-y-1">
            <h3 className="font-bold text-lg text-[#2D3A3A]">{order.className}</h3>
            <p className="text-muted-foreground">{instructor}</p>
            <p className="text-[#2D3A3A] font-medium">
                {(order.price || basePrice).toLocaleString()}원
            </p>
        </div>
    );
};
