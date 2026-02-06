import React, { useState, useRef } from "react";
import { Camera, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileDragAndDropProps {
    /** 첨부된 파일 리스트 상태 */
    files: File[];
    /** 파일 리스트 상태 업데이트 함수 */
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;
    /** 최대 첨부 가능 파일 수 (기본값: 무제한) */
    maxFiles?: number;
    /** 허용할 파일 타입 (기본값: 이미지 및 비디오) */
    accept?: string;
    /** 업로드 박스 내부에 표시될 추가 안내 문구 */
    hintText?: React.ReactNode;
    /** 컴포넌트 전체에 적용할 추가 클래스명 */
    className?: string;
}

/**
 * 범용적으로 사용할 수 있는 파일 드래그 앤 드롭 및 클릭 업로드 컴포넌트입니다.
 * 파일 선택, 드래그 앤 드롭 피드백, 미리보기 그리드, 삭제 기능을 제공합니다.
 */
const FileDragAndDrop: React.FC<FileDragAndDropProps> = ({
    files,
    setFiles,
    maxFiles,
    accept = "image/*",
    hintText,
    className,
}) => {
    // 마우스 드래그가 업로드 영역 위에 있는지 여부를 관리하는 상태
    const [isDragging, setIsDragging] = useState(false);
    // 숨겨진 원본 input 엘리먼트에 접근하기 위한 ref
    const fileInputRef = useRef<HTMLInputElement>(null);

    /**
     * 파일이 업로드 영역 안으로 들어왔을 때의 처리
     */
    const onDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    /**
     * 파일이 업로드 영역을 벗어났을 때의 처리
     */
    const onDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    /**
     * 파일이 업로드 영역 위에서 움직일 때의 처리 (기본 브라우저 동작 방지 필요)
     */
    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    /**
     * 파일을 영역 위에 떨어뜨렸을(Drop) 때의 처리
     */
    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false); // 드래그 상태 해제

        if (e.dataTransfer.files) {
            addFiles(Array.from(e.dataTransfer.files));
        }
    };

    /**
     * input[type="file"]을 통해 파일이 선택되었을 때의 처리
     */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            addFiles(Array.from(e.target.files));
        }
    };

    /**
     * 선택된 파일들을 기존 리스트에 추가하고 유효성 검사를 수행하는 내부 함수
     */
    const addFiles = (newFiles: File[]) => {
        setFiles((prev) => {
            const combined = [...prev, ...newFiles];
            // 최대 파일 수 제한이 있는 경우 처리
            if (maxFiles && combined.length > maxFiles) {
                alert(`최대 ${maxFiles}개까지만 첨부할 수 있습니다.`);
                return combined.slice(0, maxFiles);
            }
            return combined;
        });
    };

    /**
     * 특정 인덱스의 파일을 리스트에서 제거하는 처리
     */
    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className={cn("w-full space-y-4", className)}>
            {/* 드래그 앤 드롭 및 클릭 업로드 영역 */}
            <div
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onClick={() => fileInputRef.current?.click()} // 박스 클릭 시 파일 탐색기 열기
                className={cn(
                    "w-full h-[90px] border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer transition-all group",
                    isDragging
                        ? "border-purple-400 bg-purple-50" // 파일을 드래그 중일 때의 강조 스타일
                        : "border-gray-200 bg-white hover:bg-gray-50" // 기본 스타일 및 호버 스타일
                )}
            >
                {/* 실제 파일 선택 input (UI상으로는 숨김) */}
                <input
                    type="file"
                    multiple
                    accept={accept}
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />

                {/* 업로드 아이콘 및 메인 문구 */}
                <div className="flex items-center gap-2 font-bold text-gray-700">
                    <Camera className="w-5 h-5 text-gray-800" />
                    <span className="text-[15px] text-gray-800 font-bold">이미지 첨부하기</span>
                </div>

                {/* 추가 안내 문구 (hintText 프롭이 있을 경우 표시) */}
                {hintText && (
                    <div className="text-xs text-gray-400 mt-1">
                        {hintText}
                    </div>
                )}
            </div>

            {/* 첨부된 파일 미리보기 그리드 (파일이 있을 때만 렌더링) */}
            {files.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                    {files.map((file, idx) => (
                        <div key={idx} className="relative aspect-square rounded-md overflow-hidden bg-gray-100 group border">
                            {/* 이미지 파일인 경우 미리보기 표시, 아니면 파일명 표시 */}
                            {file.type.startsWith('image/') ? (
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt="preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-[10px] text-gray-500 p-1 break-all">
                                    {file.name}
                                </div>
                            )}

                            {/* 개별 파일 삭제 버튼 (호버 시 표시) */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // 부모 클릭 방지
                                    removeFile(idx);
                                }}
                                className="absolute top-1 right-1 bg-black/50 rounded-full p-0.5 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                title="삭제"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FileDragAndDrop;
