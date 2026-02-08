import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEffect } from "react";

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  autoCloseDuration?: number; // 자동 닫힘 시간 (ms)
}

/**
 * 버튼 없이 안내만 하는 알림 다이얼로그
 * autoCloseDuration을 설정하면 자동으로 닫힙니다
 * CSS 애니메이션 적용
 */
function AlertNotification({
  open,
  onOpenChange,
  title,
  description,
  autoCloseDuration = 500,
}: AlertDialogProps) {
  useEffect(() => {
    if (open && autoCloseDuration > 0) {
      const timer = setTimeout(() => {
        onOpenChange(false);
      }, autoCloseDuration);

      return () => clearTimeout(timer);
    }
  }, [open, autoCloseDuration, onOpenChange]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className="max-w-md animate-in fade-in-0 zoom-in-95 slide-in-from-top-4 duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-bottom-4"
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription className="whitespace-pre-line text-center">
              {description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default AlertNotification;
