import ConfirmDialog from "@/components/common/ConfirmDialog";
import { useNavigate } from "react-router-dom";

interface LoginRequiredDialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
  onCancel?: () => void;
}

function LoginRequiredDialog({
  open,
  onOpenChange = () => { },
  title = "로그인이 필요해요",
  description = "해당 기능은 로그인 후 이용할 수 있어요.\n로그인 페이지로 이동하시겠습니까?",
  confirmText = "로그인하기",
  cancelText = "취소",
  showCancel = true,
  onCancel,
}: LoginRequiredDialogProps) {
  const navigate = useNavigate();

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      confirmText={confirmText}
      cancelText={showCancel ? cancelText : undefined}
      onConfirm={() => navigate("/login")}
      onCancel={onCancel}
    />
  );
}

export default LoginRequiredDialog;
