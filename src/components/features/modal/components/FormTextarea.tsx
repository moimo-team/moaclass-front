import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

import type { UseFormRegisterReturn } from 'react-hook-form';

interface FormTextareaProps {
	id: string;
	label: string;
	register: UseFormRegisterReturn;
	placeholder?: string;
	required?: boolean;
	maxLength?: number;
	minLength?: number;
	currentLength?: number;
	error?: string;
	className?: string;
	labelClassName?: string;
}

/**
 * React Hook Form 통합 Textarea 컴포넌트
 * - 글자 수 카운터 자동 표시
 * - 에러 메시지 통합 처리
 * - 프로필, 모임, 클래스 등 다양한 폼에서 재사용 가능
 */
export const FormTextarea = ({
	id,
	label,
	register,
	placeholder,
	required = false,
	maxLength,
	minLength,
	currentLength = 0,
	error,
	className = 'min-h-[200px]',
	labelClassName,
}: FormTextareaProps) => {
	return (
		<div className="space-y-2">
			<Label htmlFor={id} className={cn('text-sm font-bold text-gray-700', labelClassName)}>
				{label} {required && <span className="text-red-500">*</span>}
			</Label>
			<Textarea
				id={id}
				{...register}
				placeholder={placeholder}
				className={`${className} bg-white border-gray-200 rounded-lg resize-none focus-visible:ring-yellow-400 text-sm`}
				maxLength={maxLength}
			/>
			{maxLength && (
				<p className="text-xs text-gray-400">
					{currentLength}/{maxLength}자{minLength && ` (최소 ${minLength}자)`}
				</p>
			)}
			{error && <p className="text-xs text-red-500">{error}</p>}
		</div>
	);
};
