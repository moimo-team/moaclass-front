import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface FormModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit?: (e: React.FormEvent) => void;
	onDraft?: () => void;
	title: string;
	children: ReactNode;
	submitButtonText?: string;
	draftButtonText?: string;
	isSubmitDisabled?: boolean;
	isLoading?: boolean;
	loadingComponent?: ReactNode;
	showFooter?: boolean;
	containerClassName?: string;
}

/**
 * 범용 폼 모달 컴포넌트
 * - 고정 헤더 + 스크롤 가능한 본문 + 고정 버튼 구조
 * - 로딩 상태 자동 처리
 * - 프로필, 모임, 클래스 등 다양한 폼에서 재사용 가능
 */
export const FormModal = ({
	isOpen,
	onClose,
	onSubmit,
	onDraft,
	title,
	children,
	submitButtonText = '저장하기',
	draftButtonText,
	isSubmitDisabled = false,
	isLoading = false,
	loadingComponent,
	showFooter = true,
	containerClassName = 'max-w-xl',
}: FormModalProps) => {
	const content = (
		<>
			{/* 스크롤바 */}
			<div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar">
				{children}
			</div>

			{/* 고정된 버튼 */}
			{showFooter && (
				<div className="px-6 py-4 border-t">
					<div className={cn('gap-4', onDraft ? 'grid grid-cols-2' : 'flex')}>
						{onDraft && (
							<Button
								type="button"
								onClick={onDraft}
								disabled={isLoading}
								className="h-12 bg-white hover:bg-gray-50 text-gray-700 font-bold rounded-lg border border-gray-200 shadow-sm"
							>
								{isLoading ? '처리 중...' : draftButtonText || '임시저장'}
							</Button>
						)}
						<Button
							type="submit"
							disabled={isSubmitDisabled || isLoading}
							className="w-full h-12 bg-primary hover:bg-primary/80 text-white font-bold rounded-lg shadow-sm disabled:bg-gray-200 disabled:text-gray-400 border-none"
						>
							{isLoading ? '처리 중...' : submitButtonText}
						</Button>
					</div>
				</div>
			)}
		</>
	);

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent
				className={cn(
					'p-0 bg-white rounded-2xl flex flex-col max-h-[90vh]',
					containerClassName,
				)}
			>
				{/* 고정된 헤더 */}
				<DialogHeader className="px-6 pt-6 pb-4 border-b">
					<DialogTitle className="text-2xl font-bold text-center text-[#1A2B4B]">
						{title}
					</DialogTitle>
				</DialogHeader>

				{isLoading && loadingComponent ? (
					<div className="px-6 py-6">{loadingComponent}</div>
				) : onSubmit ? (
					<form onSubmit={onSubmit} className="flex flex-col flex-1 overflow-hidden">
						{content}
					</form>
				) : (
					<div className="flex flex-col flex-1 overflow-hidden">{content}</div>
				)}
			</DialogContent>
		</Dialog>
	);
};
