import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { UseFormRegisterReturn } from "react-hook-form";

interface ProfileFormTextareaProps {
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
}

export const ProfileFormTextarea = ({
  id,
  label,
  register,
  placeholder,
  required = false,
  maxLength,
  minLength,
  currentLength = 0,
  error,
  className = "min-h-[200px]",
}: ProfileFormTextareaProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-bold text-gray-700">
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
