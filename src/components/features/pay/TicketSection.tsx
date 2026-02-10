import { PaySectionCard } from "./PaySectionCard";
import { formatClassCreateDate, formatDateSeparator } from "@/utils/dateFormat";
import type { PayPreviewResponse } from "@/models/pay.model";

interface TicketSectionProps {
  lesson: PayPreviewResponse["lesson"];
}

export const TicketSection = ({ lesson }: TicketSectionProps) => {
  return (
    <PaySectionCard title="클래스 티켓 정보">
      <div className="space-y-4">
        <div className="aspect-video rounded-lg overflow-hidden bg-muted">
          <img
            src={lesson.representativeImage}
            alt="Class Thumbnail"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-muted-foreground font-semibold mb-0.5">
              클래스 명
            </p>
            <p className="font-medium text-base">{lesson.title}</p>
          </div>
          <div>
            <p className="text-muted-foreground font-semibold mb-0.5">일시</p>
            <p>{formatClassCreateDate(lesson.schedule.startAt)}</p>
          </div>
          <div>
            <p className="text-muted-foreground font-semibold mb-0.5">장소</p>
            <p>{lesson.address}</p>
          </div>
        </div>
      </div>
    </PaySectionCard>
  );
};
