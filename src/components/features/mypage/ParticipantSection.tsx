import type { ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ParticipantSectionProps {
  title: string;
  count: number;
  isOpen: boolean;
  onToggle: () => void;
  actionButton?: ReactNode;
  children: ReactNode;
  contentClassName?: string;
}

const ParticipantSection = ({
  title,
  count,
  isOpen,
  onToggle,
  actionButton,
  children,
  contentClassName,
}: ParticipantSectionProps) => {
  return (
    <div className="mb-12 pl-12">
      <div
        className="flex justify-between items-center pb-4 border-b border-gray-200 cursor-pointer mb-6"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4">
          <span className="text-lg font-semibold text-gray-900">{title}</span>
          <span className="text-[#6B66FF] font-semibold">{String(count).padStart(2, '0')}명</span>
        </div>
        <div className="flex items-center gap-4">
          {actionButton}
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {isOpen && (
        <div className={cn("space-y-4", contentClassName)}>
          {children}
        </div>
      )}
    </div>
  );
};

export default ParticipantSection;