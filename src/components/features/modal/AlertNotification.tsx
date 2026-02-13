import { useEffect } from 'react';

import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogAction,
} from '@/components/ui/alert-dialog';

interface AlertDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description?: React.ReactNode;
	autoCloseDuration?: number; // 자동 닫힘 시간 (ms)
	hasButton?: boolean; // 버튼 표시 여부
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
	autoCloseDuration,
	hasButton = false,
}: AlertDialogProps) {
	// 버튼이 없으면 기본 2000ms(2초) 자동 닫힘 적용
	const effectiveDuration = autoCloseDuration ?? (hasButton ? 0 : 2000);

	useEffect(() => {
		if (open && effectiveDuration > 0) {
			const timer = setTimeout(() => {
				onOpenChange(false);
			}, effectiveDuration);

			return () => clearTimeout(timer);
		}
	}, [open, effectiveDuration, onOpenChange]);

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent className="max-w-md animate-in fade-in-0 zoom-in-95 slide-in-from-top-4 duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-bottom-4">
				<AlertDialogHeader>
					<AlertDialogTitle className="text-center">{title}</AlertDialogTitle>
					{description && (
						<AlertDialogDescription className="text-center" asChild>
							<div>{description}</div>
						</AlertDialogDescription>
					)}
				</AlertDialogHeader>
				{hasButton && (
					<AlertDialogFooter>
						<AlertDialogAction className="w-full bg-slate-800 text-white hover:bg-slate-700">
							확인
						</AlertDialogAction>
					</AlertDialogFooter>
				)}
			</AlertDialogContent>
		</AlertDialog>
	);
}

export default AlertNotification;
