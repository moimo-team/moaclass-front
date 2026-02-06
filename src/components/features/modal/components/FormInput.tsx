import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { UseFormRegisterReturn } from "react-hook-form";

interface FormInputProps {
  id: string;
  label: string;
  register: UseFormRegisterReturn;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  currentLength?: number;
  suffix?: string;
  error?: string;
  className?: string;
}

/**
 * React Hook Form 통합 Input 컴포넌트
 * - 글자 수 카운터 자동 표시
 * - 에러 메시지 통합 처리
 * - 프로필, 모임, 클래스 등 다양한 폼에서 재사용 가능
 * - MeetingModal 디자인 스타일 적용 (h-12)
 */
export const FormInput = ({
  id,
  label,
  register,
  placeholder,
  required = false,
  maxLength,
  currentLength = 0,
  suffix,
  error,
  className = "",
}: FormInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-bold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative">
        <Input
          id={id}
          {...register}
          placeholder={placeholder}
          className={`h-12 bg-white border-gray-200 rounded-lg focus-visible:ring-yellow-400 pr-10 ${className}`}
          maxLength={maxLength}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">
            {suffix}
          </span>
        )}
      </div>
      {maxLength && (
        <p className="text-xs text-gray-400">
          {currentLength}/{maxLength}자
        </p>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
