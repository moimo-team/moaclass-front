import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface RefundRuleSectionProps {
  className?: string;
}

export const RefundRuleSection = ({ className }: RefundRuleSectionProps) => {
  return (
    <div
      className={cn(
        "border border-gray-200 rounded-lg overflow-hidden text-sm",
        className,
      )}
    >
      <table className="w-full text-inherit">
        <thead>
          <tr className="bg-gray-50 text-gray-600 border-b border-gray-200 text-left">
            <th className="p-3 font-medium">날짜 별 취소 및 환불 정책</th>
            <th className="p-3 font-medium">환불율</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          <tr>
            <td className="p-3 text-gray-600">클래스 4일 이전 취소</td>
            <td className="p-3 text-primary font-medium">100% 환불</td>
          </tr>
          <tr>
            <td className="p-3 text-gray-600">클래스 3일 전 취소</td>
            <td className="p-3 text-gray-900 font-medium">70% 환불</td>
          </tr>
          <tr>
            <td className="p-3 text-gray-600">클래스 2일 전 취소</td>
            <td className="p-3 text-gray-900 font-medium">50% 환불</td>
          </tr>
          <tr className="text-destructive bg-destructive/5">
            <td className="p-3">클래스 하루 전 또는 당일 취소</td>
            <td className="p-3 font-bold">환불 불가</td>
          </tr>
        </tbody>
      </table>
      <div className="bg-gray-50 p-4 border-t border-gray-100">
        <div className="flex gap-2.5">
          <AlertCircle className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
          <div className="space-y-1.5">
            <p className="text-xs text-gray-500 leading-relaxed">
              쿠폰, 할인권, 프로모션 혜택은 주문 취소 또는 환불 시 복구되지
              않습니다.
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              환불 금액은 쿠폰 적용 후 실제 결제 금액을 기준으로 산정됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
