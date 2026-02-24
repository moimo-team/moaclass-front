'use client';

import { forwardRef } from 'react';

import { Upload, Camera, X } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

import FileDragAndDrop from '@/components/common/FileDragAndDrop';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { validateImageFile, fileToDataURL } from '@/utils/imageValidation';

interface FormImageUploadProps {
	previewImage?: string | null;
	previewImages?: string[];
	onImageChange?: (dataUrl: string, file: File) => void;
	onImagesChange?: (dataUrls: string[], files: File[]) => void;
	onRemoveImage?: (index: number) => void;
	variant?: 'form' | 'profile' | 'multiple';
	shape?: 'circle' | 'square';
	readOnly?: boolean;
	label?: string;
	description?: string;
	required?: boolean;
	maxImages?: number;
	className?: string;
	// 드래그 앤 드롭 관련 optional props
	enableDragAndDrop?: boolean;
	dragDropHintText?: React.ReactNode;
	dragDropClassName?: string;
	error?: string;
	labelClassName?: string;
}

/**
 * 통합 이미지 업로드 컴포넌트
 * - variant="profile": 프로필 전용 스타일 (카메라 아이콘 오버레이)
 * - variant="form": 단일 이미지 업로드 (그리드 미리보기) - 기본값
 * - variant="multiple": 다중 이미지 업로드 (그리드 미리보기)
 * - 파일 검증 (타입, 크기, 한글 파일명) 자동 처리
 * - 원형/사각형 지원
 * - 선택적 드래그 앤 드롭 지원 (enableDragAndDrop prop)
 */
export const FormImageUpload = forwardRef<HTMLInputElement, FormImageUploadProps>(
	(
		{
			previewImage,
			previewImages = [],
			onImageChange,
			onImagesChange,
			onRemoveImage,
			variant = 'form',
			shape = 'square',
			readOnly = false,
			label,
			description,
			required = false,
			maxImages = 8,
			className,
			enableDragAndDrop = false, // 드래그 앤 드롭 지원 여부
			dragDropHintText, // 드래그 앤 드롭 영역에 추가할 텍스트
			dragDropClassName, // 드래그 앤 드롭 영역 className
			error,
			labelClassName,
		},
		ref,
	) => {
		/**
		 * 파일 처리 공통 로직
		 */
		const processFiles = async (files: File[]) => {
			// 단일 이미지 모드 (form 또는 profile)
			if ((variant === 'form' || variant === 'profile') && onImageChange) {
				const file = files[0];
				const validation = validateImageFile(file);
				if (!validation.isValid) {
					toast.error(validation.error!, {
						description: validation.errorDescription,
					});
					return;
				}

				try {
					const dataUrl = await fileToDataURL(file);
					onImageChange(dataUrl, file);
				} catch (error) {
					console.error('Image conversion failed:', error);
					toast.error('이미지 변환에 실패했습니다');
				}
				return;
			}

			// 다중 이미지 모드
			if (variant === 'multiple' && onImagesChange) {
				const validFiles: File[] = [];

				for (const file of files) {
					const validation = validateImageFile(file);
					if (!validation.isValid) {
						toast.error(`${file.name}: ${validation.error}`);
						continue;
					}
					validFiles.push(file);
				}

				if (validFiles.length === 0) return;

				// 최대 개수 체크
				if (previewImages.length + validFiles.length > maxImages) {
					toast.error(`최대 ${maxImages}장까지 업로드 가능합니다`);
					return;
				}

				try {
					const dataUrls = await Promise.all(
						validFiles.map((file) => fileToDataURL(file)),
					);
					// 기존 Data URL들과 새로 추가된 Data URL들을 병합하여 전달
					// 두 번째 인자로 새로 추가된 File 객체 배열만 전달 (부모에서 관리 목적)
					onImagesChange([...previewImages, ...dataUrls], validFiles);
				} catch (error) {
					console.error('Image conversion failed:', error);
					toast.error('이미지 변환에 실패했습니다');
				}
			}
		};

		const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
			const files = e.target.files;
			if (!files || files.length === 0) return;

			await processFiles(Array.from(files));
			e.target.value = '';
		};

		const handleButtonClick = () => {
			if (ref && 'current' in ref && ref.current) {
				ref.current.click();
			}
		};

		const handleRemove = (index: number) => {
			if (onRemoveImage) {
				onRemoveImage(index);
			}
		};

		// Profile 스타일 (카메라 오버레이)
		if (variant === 'profile') {
			return (
				<div className={cn('flex flex-col items-center gap-4', className)}>
					{label && (
						<label className={cn('text-sm font-bold text-gray-700', labelClassName)}>
							{label} {required && <span className="text-red-500">*</span>}
						</label>
					)}
					<div className="relative">
						<div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200">
							{previewImage ? (
								<Image
									src={previewImage}
									alt="Profile Preview"
									width={128}
									height={128}
									unoptimized
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
					{error && <p className="text-xs text-red-500 mt-1">{error}</p>}
				</div>
			);
		}

		// Form 스타일 (단일 이미지 - 그리드 미리보기)
		if (variant === 'form') {
			return (
				<div className={cn('space-y-3', className)}>
					{label && (
						<div className="space-y-1">
							<label
								className={cn('text-sm font-bold text-gray-700', labelClassName)}
							>
								{label} {required && <span className="text-red-500">*</span>}
							</label>
							{description && <p className="text-xs text-gray-500">{description}</p>}
						</div>
					)}

					<div className="space-y-3">
						{/* 이미지 미리보기 (있을 경우) */}
						{previewImage && (
							<div className="relative group w-full">
								<Image
									src={previewImage}
									alt="Preview"
									width={1200}
									height={920}
									unoptimized
									className={cn(
										'w-full h-92 object-cover border-2 border-gray-200',
										shape === 'circle' ? 'rounded-full' : 'rounded-lg',
									)}
								/>
								{!readOnly && onRemoveImage && (
									<button
										type="button"
										onClick={() => handleRemove(0)}
										aria-label="이미지 삭제"
										className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity border border-gray-200"
									>
										<X className="h-4 w-4 text-gray-600" />
									</button>
								)}
							</div>
						)}

						{/* 드래그 앤 드롭 영역 또는 업로드 버튼 */}
						{!readOnly && (
							<>
								{enableDragAndDrop ? (
									<FileDragAndDrop
										onFileSelect={processFiles}
										hintText={dragDropHintText}
										className={dragDropClassName}
										disabled={readOnly}
									/>
								) : (
									<Button
										type="button"
										variant="outline"
										className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground border-none"
										onClick={handleButtonClick}
									>
										<Upload className="mr-2 h-4 w-4" />
										{previewImage ? '이미지 변경' : '이미지 찾기'}
									</Button>
								)}
							</>
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
					{error && <p className="text-xs text-red-500 mt-1">{error}</p>}
				</div>
			);
		}

		// Multiple 스타일 (다중 이미지 - 그리드 미리보기)
		return (
			<div className={cn('space-y-3', className)}>
				{label && (
					<div className="space-y-1">
						<label className={cn('text-sm font-bold text-gray-700', labelClassName)}>
							{label} {required && <span className="text-red-500">*</span>}
						</label>
						{description && <p className="text-xs text-gray-500">{description}</p>}
					</div>
				)}

				<div className="space-y-3">
					{/* 이미지 미리보기 그리드 */}
					{previewImages.length > 0 && (
						<div className="grid grid-cols-5 gap-3">
							{previewImages.map((image, index) => (
								<div key={index} className="relative group">
									{/* 순서 숫자 (1, 2, 3...) */}
									<div className="absolute top-2 left-2 z-10 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm min-w-[18px] text-center border border-white/20 pointer-events-none">
										{index + 1}
									</div>
									<Image
										src={image}
										alt={`이미지 ${index + 1}`}
										width={320}
										height={320}
										unoptimized
										className="w-full aspect-square object-cover rounded-lg border-2 border-gray-200"
									/>
									{!readOnly && (
										<button
											type="button"
											onClick={() => handleRemove(index)}
											aria-label="이미지 삭제"
											className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity border border-gray-200"
										>
											<X className="h-4 w-4 text-gray-600" />
										</button>
									)}
								</div>
							))}
						</div>
					)}

					{/* 드래그 앤 드롭 영역 또는 업로드 버튼 */}
					{!readOnly && previewImages.length < maxImages && (
						<>
							{enableDragAndDrop ? (
								<FileDragAndDrop
									onFileSelect={processFiles}
									hintText={dragDropHintText}
									className={dragDropClassName}
									disabled={readOnly}
								/>
							) : (
								<Button
									type="button"
									variant="outline"
									onClick={handleButtonClick}
									className="w-full h-12"
								>
									<Upload className="h-4 w-4 mr-2" />
									추가 이미지 업로드 ({previewImages.length}/{maxImages})
								</Button>
							)}
						</>
					)}

					{/* Hidden File Input */}
					<input
						ref={ref}
						type="file"
						accept="image/*"
						multiple
						onChange={handleFileChange}
						className="hidden"
						disabled={readOnly}
					/>
				</div>
				{error && <p className="text-xs text-red-500 mt-1">{error}</p>}
			</div>
		);
	},
);

FormImageUpload.displayName = 'FormImageUpload';
