import { Plus } from "lucide-react";

interface CreateClassButtonProps {
  onClick: () => void;
}

export function CreateClassButton({ onClick }: CreateClassButtonProps) {
  return (
    <div
      onClick={onClick}
      className="border-2 border-primary/50 border-muted-foreground/30 rounded-lg bg-muted/20 hover:bg-muted/40 hover:border-primary/50 transition-colors cursor-pointer flex flex-col items-center justify-center aspect[3/4] min-h-[350px]"
    >
      <Plus className="h-16 w-16 text-primary mb-4" />
      <p className="font-nanum-bold text-lg text-primary">
        클래스 생성하기
      </p>
    </div>
  );
}
