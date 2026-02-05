import { Button } from "@/components/ui/button";

interface ClassManageActionsProps {
  onManage: () => void;
  onViewClass: () => void;
  onEdit: () => void;
}

export const ClassManageButtons = ({
  onManage,
  onViewClass,
  onEdit,
}: ClassManageActionsProps) => {
  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        className="w-full"
        onClick={onManage}
      >
        일정 및 예약 관리
      </Button>
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onViewClass}
        >
          클래스 바로가기
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={onEdit}
        >
          내용 수정
        </Button>
      </div>
    </div>
  );
};
