import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { FaRegHeart } from "react-icons/fa";
import { toast } from "sonner";
import { toYYYYMMDD } from "@/utils/dateFormat";

interface LessonReservationSidebarProps {
  reservationLeadDays: number;
  price: number;
  discountRate: number;
  discountedPrice: number;
  isLoggedIn: boolean;
  today: Date;
  threeMonthsLater: Date;
  onWishlistToggle: () => void;
  onInquiry: () => void;
  onApplyLesson: (selectedDate: string | undefined, headcount: number) => void;
  showLoginPrompt: (show: boolean) => void;
}

export const LessonReservationSidebar = ({
  reservationLeadDays,
  price,
  discountRate,
  discountedPrice,
  isLoggedIn,
  today,
  threeMonthsLater,
  onWishlistToggle,
  onInquiry,
  onApplyLesson,
  showLoginPrompt,
}: LessonReservationSidebarProps) => {
  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    undefined,
  );
  const [headcount, setHeadcount] = useState(1);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(toYYYYMMDD(date.toISOString()));
    } else {
      setSelectedDate(undefined);
    }
  };

  const handleHeadcountChange = (amount: number) => {
    setHeadcount((prev) => Math.max(1, Math.min(50, prev + amount)));
  };

  const handleApplyClick = () => {
    if (!isLoggedIn) {
      showLoginPrompt(true);
      return;
    }
    if (!selectedDate) {
      toast.error("날짜를 선택해주세요.");
      return;
    }
    onApplyLesson(selectedDate, headcount);
  };

  return (
    <div className="md:col-span-1">
      <div className="sticky top-12 space-y-6">
        <Card className="border-2 border-border/50 shadow-sm overflow-hidden rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4">클래스 예약하기</h2>

          <div className="mb-6">
            <p className="text-lg font-semibold mb-2">날짜 선택</p>
            <Calendar
              mode="single"
              selected={selectedDate ? new Date(selectedDate) : undefined}
              onSelect={handleDateSelect}
              initialFocus
              disabled={(date) => date < today || date > threeMonthsLater}
              className="rounded-md border mx-auto"
            />
          </div>

          <div className="bg-secondary/20 p-4 rounded-md text-sm text-muted-foreground mb-6">
            <p>최소 예약 {reservationLeadDays}일 전 예약 가능합니다.</p>
            {/* TODO: 인원별 할인 정책 추가 */}
            <p>인원별 할인 정책은 현재 적용되지 않습니다.</p>
          </div>

          <div className="mb-6">
            <p className="text-lg font-semibold mb-2">인원 선택</p>
            <div className="flex items-center justify-between border rounded-md p-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleHeadcountChange(-1)}
                disabled={headcount <= 1}
              >
                -
              </Button>
              <Input
                type="number"
                value={headcount}
                readOnly
                className="w-16 text-center text-lg font-semibold border-none focus-visible:ring-0"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleHeadcountChange(1)}
                disabled={headcount >= 50}
              >
                +
              </Button>
            </div>
          </div>

          <div className="text-right mb-4">
            {discountRate > 0 && (
              <div className="flex items-center justify-end gap-2 text-muted-foreground line-through text-sm">
                <span>{price.toLocaleString()}원</span>
                <span className="text-red-500 font-semibold">
                  {discountRate}%
                </span>
              </div>
            )}
            <div className="text-3xl font-bold text-primary">
              {(discountedPrice * headcount).toLocaleString()}원
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              ({headcount}명 기준)
            </p>
          </div>

          <div className="flex flex-col space-y-3">
            <Button
              variant="outline"
              className="w-full text-lg py-6"
              onClick={onWishlistToggle}
            >
              <FaRegHeart className="mr-2 text-xl" />
              위시리스트
            </Button>
            <Button
              variant="secondary"
              className="w-full text-lg py-6"
              onClick={onInquiry}
            >
              문의하기
            </Button>
            <Button
              className="w-full text-lg py-6 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleApplyClick}
              disabled={!selectedDate}
            >
              클래스 신청
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
