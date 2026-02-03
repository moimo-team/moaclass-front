import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import type { ClassCardData } from "@/models/class.model";
import { ClassManageButtons } from "./ClassManageButtons";


interface ClassCardProps {
  classData: ClassCardData;
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onManage?: () => void;
  onViewClass?: () => void;
  onToggleStatus?: () => void;
}

export function ClassManageCard({
  classData,
  onEdit,
  onDelete,
  onDuplicate,
  onManage,
  onViewClass,
  onToggleStatus,
}: ClassCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge variant="active">운영중</Badge>;
      case "INACTIVE":
        return <Badge variant="inactive">휴면</Badge>;
      case "DRAFT":
        return <Badge variant="draft">임시저장</Badge>;
      case "DUPLICATED":
        return <Badge variant="duplicated">복제됨</Badge>;
      case "DELETED":
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-card hover:shadow-lg transition-shadow">
      {/* 헤더 */}
      <div className="relative">
        <div className="absolute top-3 left-3 z-10">
          {getStatusBadge(classData.status)}
        </div>
        {/* 드롭다운(복제,휴면,삭제) */}
        <div className="absolute top-3 right-3 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/80 hover:bg-white">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onDuplicate}>클래스 복제</DropdownMenuItem>
              <DropdownMenuItem onClick={onToggleStatus}>
                {classData.status === "ACTIVE" ? "휴면" : "휴면 해제"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* 썸네일 */}
        <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
          {/* 휴면 상태 오버레이 */}
          {classData.status === "INACTIVE" && (
            <div className="absolute inset-0 z-10 bg-black/40 flex items-center justify-center">
              <span className="bg-black/60 text-white px-3 py-1.5 rounded-full text-sm font-bold border border-white/20">
                내용 수정에서 활성화하세요
              </span>
            </div>
          )}
          <img
            src={classData.thumbnailImage}
            alt={classData.title}
            className={cn(
              "w-full h-full object-cover",
              classData.status === "INACTIVE" && "grayscale-[0.5]"
            )}
          />
        </div>
      </div>

      {/* 내용 */}
      <div className="p-4 space-y-3">
        {/* 날짜와 카테고리 */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground mb-1">
              {classData.createdAt}
            </p>
            <h3 className="font-nanum-bold text-base line-clamp-1 break-all">
              {classData.title}
            </h3>
          </div>
          <span className="inline-block px-2 py-1 text-sm text-primary bg-secondary/20 border border-secondary rounded whitespace-nowrap flex-shrink-0">
            {/* TODO: 카테고리 별 색상 도입 희망 */}
            {classData.category}
          </span>
        </div>

        {/* 버튼들 */}
        <ClassManageButtons
          onManage={onManage || (() => { })}
          onViewClass={onViewClass || (() => { })}
          onEdit={onEdit || (() => { })}
        />
      </div>
    </div>
  );
}
