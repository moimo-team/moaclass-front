import { Camera } from "lucide-react";
import { Label } from "@/components/ui/label";
import { forwardRef } from "react";

interface ProfileImageUploadProps {
  previewImage: string;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  required?: boolean;
  readOnly?: boolean;
}

export const ProfileImageUpload = forwardRef<HTMLInputElement, ProfileImageUploadProps>(
  ({ previewImage, onImageChange, label = "프로필 사진", required = false, readOnly = false }, ref) => {
    const handleClick = () => {
      if (!readOnly && ref && 'current' in ref && ref.current) {
        ref.current.click();
      }
    };

    return (
      <div className="flex flex-col items-center gap-4">
        {label && (
          <Label className="text-sm font-bold">
            {label} {required && <span className="text-red-500">*</span>}
          </Label>
        )}
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <Camera className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          {!readOnly && (
            <button
              type="button"
              onClick={handleClick}
              className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Camera className="w-5 h-5 text-gray-600" />
            </button>
          )}
          <input
            type="file"
            ref={ref}
            onChange={onImageChange}
            className="hidden"
            accept="image/*"
          />
        </div>
      </div>
    );
  }
);

ProfileImageUpload.displayName = "ProfileImageUpload";
