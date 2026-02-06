import React, { useState, useRef } from "react";
import { Camera } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileDragAndDropProps {
    /** 파일 선택 시 호출될 콜백 (File 배열 전달) */
    onFileSelect: (files: File[]) => void;
    /** 허용할 파일 타입 (기본값: image/*) */
    accept?: string;
    /** 업로드 박스 내부에 표시될 안내 문구 */
    hintText?: React.ReactNode;
    /** 컴포넌트 스타일 클래스 */
    className?: string;
    /** 비활성화 여부 */
    disabled?: boolean;
}

/**
 * 파일 드래그 앤 드롭 및 클릭 업로드 컴포넌트 (Pure UI)
 * - 파일 선택/드롭 이벤트 처리
 * - 선택된 File 객체 배열을 부모에게 전달
 * - 유효성 검사 및 변환 로직은 부모 컴포넌트에 위임
 */
const FileDragAndDrop: React.FC<FileDragAndDropProps> = ({
    onFileSelect,
    accept = "image/*",
    hintText,
    className,
    disabled = false,
}) => {
    // 마우스 드래그 상태
    const [isDragging, setIsDragging] = useState(false);
    // input 접근 ref
    const fileInputRef = useRef<HTMLInputElement>(null);

    /**
     * 파일이 업로드 영역 안으로 들어왔을 때의 처리
     */
    const onDragEnter = (e: React.DragEvent) => {
        if (disabled) return;
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    /**
     * 파일이 업로드 영역을 벗어났을 때의 처리
     */
    const onDragLeave = (e: React.DragEvent) => {
        if (disabled) return;
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    /**
     * 파일이 업로드 영역 위에서 움직일 때의 처리 (기본 브라우저 동작 방지 필요)
     */
    const onDragOver = (e: React.DragEvent) => {
        if (disabled) return;
        e.preventDefault();
        e.stopPropagation();
    };

    /**
     * 파일을 영역 위에 떨어뜨렸을(Drop) 때의 처리
     */
    const onDrop = (e: React.DragEvent) => {
        if (disabled) return;
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false); // 드래그 상태 해제

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFileSelect(Array.from(e.dataTransfer.files));
        }
    };

    /**
     * input[type="file"]을 통해 파일이 선택되었을 때의 처리
     */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onFileSelect(Array.from(e.target.files));
        }
        // input 초기화 (같은 파일 재선택 가능하도록)
        e.target.value = "";
    };

    return (
        <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onClick={() => !disabled && fileInputRef.current?.click()} // 박스 클릭 시 파일 탐색기 열기
            className={cn(
                "w-full h-[90px] border-2 border-dashed rounded-md flex flex-col items-center justify-center transition-all",
                disabled ? "bg-gray-100 border-gray-200 cursor-not-allowed" : "bg-white border-gray-200 cursor-pointer hover:bg-gray-50",
                isDragging && !disabled ? "border-purple-400 bg-purple-50" : "",
                className
            )}
        >
            <div className="flex items-center gap-2 font-bold text-gray-700">
                <Camera className={cn("w-5 h-5", disabled ? "text-gray-400" : "text-gray-800")} />
                <span className={cn("text-[15px] font-bold", disabled ? "text-gray-400" : "text-gray-800")}>
                    이미지 첨부하기
                </span>
            </div>

            {hintText && (
                <div className="text-xs text-gray-400 mt-1">
                    {hintText}
                </div>
            )}

            <input
                type="file"
                multiple
                accept={accept}
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
                disabled={disabled}
            />
        </div>
    );
};

export default FileDragAndDrop;
