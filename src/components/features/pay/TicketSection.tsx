import { PaySectionCard } from './PaySectionCard';
import { formatClassCreateDate, formatDateSeparator } from "@/utils/dateFormat";

interface TicketSectionProps {
    classInfo: {
        name: string;
        date: string;
        location: string;
        thumbnailUrl: string;
    };
}

export const TicketSection = ({ classInfo }: TicketSectionProps) => {
    return (
        <PaySectionCard title="클래스 티켓 정보">
            <div className="space-y-4">
                <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                    <img
                        src={classInfo.thumbnailUrl}
                        alt="Class Thumbnail"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="space-y-3 text-sm">
                    <div>
                        <p className="text-muted-foreground font-semibold mb-0.5">클래스 명</p>
                        <p className="font-medium text-base">{classInfo.name}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground font-semibold mb-0.5">일시</p>
                        <p>{formatClassCreateDate(classInfo.date)}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground font-semibold mb-0.5">장소</p>
                        <p>{classInfo.location}</p>
                    </div>
                </div>
            </div>
        </PaySectionCard>
    );
};
