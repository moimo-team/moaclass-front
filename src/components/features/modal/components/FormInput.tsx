import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { UseFormRegisterReturn } from "react-hook-form";

interface FormInputProps {
  id: string;
  label?: string; // 모달 등에서 라벨 없이 쓸 수도 있으므로 선택적으로 변경
  register?: UseFormRegisterReturn;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  currentLength?: number;
  suffix?: string;
  error?: string;
  readOnly?: boolean;
  disabled?: boolean;
  type?: string;
  className?: string;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

/**
 * React Hook Form 통합 Input 컴포넌트
 * - 글자 수 카운터 자동 표시
 * - 에러 메시지 통합 처리
 * - 프로필, 모임, 클래스 등 다양한 폼에서 재사용 가능
 * - MeetingModal 디자인 스타일 적용 (h-12)
 * - readOnly 시 div로 렌더링 가능 (수정 불가 필드 대응)
 */
export const FormInput = ({
  id,
  label,
  register,
  value,
  onChange,
  placeholder,
  required = false,
  maxLength,
  currentLength = 0,
  suffix,
  error,
  readOnly = false,
  disabled = false,
  type = "text",
  className = "",
  onFocus,
}: FormInputProps) => {
  const inputStyles = `h-12 bg-white border-gray-200 rounded-lg focus-visible:ring-yellow-400 pr-10 font-bold ${className}`;

  return (
    <div className="space-y-2 flex-1">
      {label && (
        <Label htmlFor={id} className="text-sm font-bold text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <div className="relative">
        {readOnly ? (
          <div
            className={`flex items-center justify-end border border-gray-200 bg-gray-50/30 ${inputStyles} cursor-default`}
          >
            {value?.toLocaleString()}
          </div>
        ) : (
          <Input
            id={id}
            type={type}
            {...register}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            className={inputStyles}
            maxLength={maxLength}
            onFocus={onFocus}
          />
        )}
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
