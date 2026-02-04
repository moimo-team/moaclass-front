import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ActionButton from "@/components/common/ActionButton";
import { FileText, Pencil, MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Order {
    id: number;
    className: string;
    date: string;
    startTime: string;
    endTime: string;
    status: string;
    imageUrl: string;
}

interface OrderClassCardProps {
    order: Order;
}

const getStatusBadgeVariant = (status: string) => {
    switch (status) {
        case "예약완료":
            return "default";
        case "참석완료":
            return "secondary";
        case "예약취소":
            return "destructive";
        default:
            return "outline";
    }
};

const OrderClassCard = ({ order }: OrderClassCardProps) => {
    const isInactive = order.status === "참석완료" || order.status === "예약취소";

    return (
        <Card
            className={cn(
                "overflow-hidden border-primary/10 hover:border-primary/30 transition-all",
                isInactive && "bg-muted/30 opacity-80"
            )}
        >
            <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row items-stretch">
                    {/* Left: Image */}
                    <div className={cn(
                        "w-full sm:w-48 h-32 sm:h-auto overflow-hidden bg-muted",
                        isInactive && "grayscale-[0.5]"
                    )}>
                        <img
                            src={order.imageUrl}
                            alt={order.className}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Middle: Info */}
                    <div className="flex-1 p-5 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant={getStatusBadgeVariant(order.status) as any}>
                                {order.status}
                            </Badge>
                            <h3 className={cn(
                                "text-lg font-bold truncate hover:text-primary cursor-pointer transition-colors",
                                isInactive && "text-muted-foreground"
                            )}>
                                {order.className}
                            </h3>
                        </div>
                        <p className="text-muted-foreground text-sm">
                            {order.date} {order.startTime} ~ {order.endTime}
                        </p>
                    </div>

                    {/* Right: Actions */}
                    <div className="p-5 border-t sm:border-t-0 sm:border-l border-primary/10 bg-sidebar/20 flex flex-col justify-center gap-2 min-w-[200px]">
                        <div className="grid grid-cols-2 gap-2">
                            <ActionButton
                                label="결제 상세"
                                theme="outline"
                                icon={<FileText className="w-3.5 h-3.5 text-primary" fill="currentColor" />}
                                className="w-full"
                            />
                            <ActionButton
                                label="후기 작성"
                                theme="primary"
                                icon={<Pencil className="w-3.5 h-3.5 text-primary" fill="currentColor" />}
                                disabled={order.status !== "참석완료"}
                                className="w-full"
                            />
                            <ActionButton
                                label="채팅 문의"
                                theme="primary"
                                icon={<MessageCircle className="w-3.5 h-3.5 text-primary" fill="currentColor" />}
                                className="w-full"
                            />
                            <ActionButton
                                label="수강 취소"
                                theme="destructive"
                                icon={<X className="w-3.5 h-3.5" />}
                                disabled={order.status !== "예약완료"}
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default OrderClassCard;
