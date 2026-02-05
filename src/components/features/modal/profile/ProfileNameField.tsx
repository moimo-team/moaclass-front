import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { UseFormRegisterReturn } from "react-hook-form";

interface ProfileFormFieldProps {
  id: string;
  label: string;
  register: UseFormRegisterReturn;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  currentLength?: number;
  error?: string;
}

export const ProfileNameField = ({
  id,
  label,
  register,
  placeholder,
  required = false,
  maxLength,
  currentLength = 0,
  error,
}: ProfileFormFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-bold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={id}
        {...register}
        placeholder={placeholder}
        className="bg-white border-gray-200 rounded-lg focus-visible:ring-yellow-400"
        maxLength={maxLength}
      />
      {maxLength && (
        <p className="text-xs text-gray-400">
          {currentLength}/{maxLength}자
        </p>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
