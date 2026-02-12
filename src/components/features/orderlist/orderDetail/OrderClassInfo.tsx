import type { CancelClassResponse } from "@/models/order.model";

interface OrderClassInfoProps {
  classInfo: CancelClassResponse;
}

export const OrderClassInfo = ({ classInfo }: OrderClassInfoProps) => {
  return (
    <div className="border border-[#4A5D4A] rounded-[16px] p-5 space-y-1">
      <h3 className="font-bold text-lg text-[#2D3A3A]">{classInfo.title}</h3>
      <p className="text-muted-foreground">{classInfo.teacherNickname}</p>
      <p className="text-[#2D3A3A] font-medium">
        {classInfo.price.toLocaleString()}원
      </p>
    </div>
  );
};
