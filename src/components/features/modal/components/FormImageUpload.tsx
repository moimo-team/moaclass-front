import { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { validateImageFile, fileToDataURL } from "@/utils/imageValidation";
import { toast } from "sonner";

interface FormImageUploadProps {
  previewImage: string | null;
  onImageChange: (dataUrl: string) => void;
  variant?: "form" | "profile";
  shape?: "circle" | "square";
  readOnly?: boolean;
  label?: string;
  description?: string;
  required?: boolean;
  className?: string;
}

/**
 * 통합 이미지 업로드 컴포넌트
 * - variant="profile": 프로필 전용 스타일 (카메라 아이콘 오버레이)
 * - variant="form": 범용 폼 스타일 (버튼 + 미리보기) - 기본값
 * - 파일 검증 (타입, 크기, 한글 파일명) 자동 처리
 * - 원형/사각형 지원
 */
export const FormImageUpload = forwardRef<HTMLInputElement, FormImageUploadProps>(
  (
    {
      previewImage,
      onImageChange,
      variant = "form",
      shape = "square",
      readOnly = false,
      label,
      description,
      required = false,
      className,
    },
    ref
  ) => {
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // 파일 검증
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        toast.error(validation.error!, {
          description: validation.errorDescription,
        });
        e.target.value = ""; // 입력 초기화
        return;
      }

      // 파일을 Data URL로 변환
      try {
        const dataUrl = await fileToDataURL(file);
        onImageChange(dataUrl);
      } catch (error) {
        console.error("Image conversion failed:", error);
        toast.error("이미지 변환에 실패했습니다");
        e.target.value = "";
      }
    };

    const handleButtonClick = () => {
      if (ref && "current" in ref && ref.current) {
        ref.current.click();
      }
    };

    // Profile 스타일 (카메라 오버레이)
    if (variant === "profile") {
      return (
        <div className={cn("flex flex-col items-center gap-4", className)}>
          {label && (
            <label className="text-sm font-bold text-gray-700">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
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
                onClick={handleButtonClick}
                className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Camera className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <input
              type="file"
              ref={ref}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
              disabled={readOnly}
            />
          </div>
        </div>
      );
    }

    // Form 스타일 (버튼 + 미리보기)
    return (
      <div className={cn("space-y-3", className)}>
        {label && (
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            {description && (
              <p className="text-xs text-gray-500">{description}</p>
            )}
          </div>
        )}

        <div className="flex items-center gap-4">
          {/* 업로드 버튼 */}
          {!readOnly && (
            <Button
              type="button"
              variant="outline"
              className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground border-none"
              onClick={handleButtonClick}
            >
              <Upload className="mr-2 h-4 w-4" />
              {previewImage ? "이미지 변경" : "이미지 찾기"}
            </Button>
          )}

          {/* 이미지 미리보기 */}
          {previewImage && (
            <div
              className={cn(
                "overflow-hidden border-2 border-gray-200",
                shape === "circle"
                  ? "w-20 h-20 rounded-full"
                  : "w-20 h-20 rounded-lg"
              )}
            >
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Hidden File Input */}
          <input
            ref={ref}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={readOnly}
          />
        </div>

        {/* TODO: 드래그앤드롭 기능 추가 예정 */}
        {/* <FileDragAndDrop onDrop={handleFileDrop} /> */}
      </div>
    );
  }
);

FormImageUpload.displayName = "FormImageUpload";
