import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ActionButton from "@/components/common/ActionButton";
import { FileText, Pencil, MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import ReviewModal from "@/components/features/review/SetReviewModal";
import type { Order, OrderStatus } from "@/models/order.model";
import { formatFullDateTime, formatTime } from "@/utils/dateFormat";

interface OrderClassCardProps {
  order: Order;
  onDetailClick?: (order: Order) => void;
}

const getStatusBadgeVariant = (status: OrderStatus) => {
  switch (status) {
    case "수강예정":
      return "default";
    case "수강완료":
      return "secondary";
    case "수강취소":
      return "carrot";
    default:
      return "outline";
  }
};

// const getStatusBadgeText = (status: OrderStatus) => {
//   switch (status) {
//     case "ACCEPTED":
//       return "수강예정";
//     case "COMPLETED":
//       return "수강완료";
//     case "CANCEL":
//       return "수강취소";
//     default:
//       return status;
//   }
// };

const OrderClassCard = ({ order, onDetailClick }: OrderClassCardProps) => {
  const navigate = useNavigate();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const isInactive = order.status === "수강완료" || order.status === "수강취소";

  return (
    <Card
      className={cn(
        "overflow-hidden border-primary/10 hover:border-primary/30 transition-all",
        isInactive && "bg-muted/30 opacity-80",
      )}
    >
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row items-stretch">
          {/* Left: Image */}
          <div
            className={cn(
              "w-full sm:w-48 h-32 sm:h-auto overflow-hidden bg-muted cursor-pointer",
              isInactive && "grayscale-[0.5]",
            )}
            onClick={() => navigate(`/lessons/${order.lessonId}`)}
          >
            <img
              src={order.image}
              alt={order.title}
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          </div>

          {/* Middle: Info */}
          <div
            className="flex-1 p-5 flex flex-col justify-center cursor-pointer"
            onClick={() => navigate(`/lessons/${order.lessonId}`)}
          >
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={getStatusBadgeVariant(order.status)}>
                {order.status}
              </Badge>
              <h3
                className={cn(
                  "text-lg font-bold truncate hover:text-primary transition-colors",
                  isInactive && "text-muted-foreground",
                )}
              >
                {order.title}
              </h3>
            </div>
            <p className="text-muted-foreground text-sm">
              {formatFullDateTime(order.date)}
            </p>
          </div>

          {/* Right: Actions */}
          <div className="p-5 border-t sm:border-t-0 sm:border-l border-primary/10 bg-sidebar/20 flex flex-col justify-center gap-2 min-w-[200px]">
            <div className="grid grid-cols-2 gap-2">
              <ActionButton
                label="결제 상세"
                theme="outline"
                icon={
                  <FileText
                    className="w-3.5 h-3.5 text-primary"
                    fill="currentColor"
                  />
                }
                className="w-full"
                onClick={() => onDetailClick?.(order)}
              />
              <ActionButton
                label="후기 작성"
                theme="primary"
                icon={
                  <Pencil
                    className="w-3.5 h-3.5 text-primary"
                    fill="currentColor"
                  />
                }
                disabled={order.status !== "수강완료"}
                className="w-full"
                onClick={() => setIsReviewModalOpen(true)}
              />
              <ActionButton
                label="채팅 문의"
                theme="carrot"
                icon={
                  <MessageCircle className="w-3.5 h-3.5 text-carrot fill-carrot" />
                }
                className="w-full"
              />
              <ActionButton
                label="수강 취소"
                theme="destructive"
                icon={<X className="w-3.5 h-3.5" />}
                disabled={order.status !== "수강예정"}
                className="w-full"
                onClick={() =>
                  navigate(`/mypage/class/orders/${order.enrollmentId}/cancel`)
                }
              />
            </div>
          </div>
        </div>
      </CardContent>
      <ReviewModal
        open={isReviewModalOpen}
        onOpenChange={setIsReviewModalOpen}
        orderId={order.enrollmentId}
      />
    </Card>
  );
};

export default OrderClassCard;
