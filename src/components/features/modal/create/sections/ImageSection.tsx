import { useRef, useState } from 'react';

import { useFormContext } from 'react-hook-form';

import { FormImageUpload } from '@/components/features/modal/components/FormImageUpload';

import type { ClassFormValues } from '../classSchema';

// CORS로 외부 이미지 직접 fetch가 차단될 수 있어 실패 시 투명 픽셀로 대체
const TRANSPARENT_PIXEL =
	'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

async function fetchAndSetDuplicateImage(
	imageUrl: string,
	setValue: (
		field: 'representativeImageFile',
		value: File,
		options?: { shouldValidate?: boolean },
	) => void,
): Promise<void> {
	try {
		const res = await fetch(imageUrl);
		const blob = await res.blob();
		const file = new File([blob], 'duplicate_image.png', { type: blob.type });
		setValue('representativeImageFile', file, { shouldValidate: true });
	} catch {
		const res = await fetch(TRANSPARENT_PIXEL);
		const blob = await res.blob();
		const dummyFile = new File([blob], 'draft_placeholder.png', { type: 'image/png' });
		setValue('representativeImageFile', dummyFile, { shouldValidate: true });
	}
}

interface ImageSectionProps {
	// 복제 모드일 때 기존 대표이미지 URL (CORS 폴백 처리용)
	initialPreviewImage?: string | null;
}

export function ImageSection({ initialPreviewImage }: ImageSectionProps) {
	const { setValue, getValues } = useFormContext<ClassFormValues>();

	const [previewImage, setPreviewImage] = useState<string | null>(initialPreviewImage ?? null);
	const [additionalImages, setAdditionalImages] = useState<string[]>([]);

	const representativeImageRef = useRef<HTMLInputElement>(null);
	const additionalImagesRef = useRef<HTMLInputElement>(null);

	const handleImageChange = (dataUrl: string, file: File) => {
		setPreviewImage(dataUrl);
		setValue('representativeImageFile', file, { shouldValidate: true });
	};

	const removeRepresentativeImage = () => {
		setPreviewImage(null);
		setValue('representativeImageFile', undefined, { shouldValidate: true });
	};

	const handleAdditionalImagesChange = (dataUrls: string[], newFiles: File[]) => {
		setAdditionalImages(dataUrls);
		const currentFiles = getValues('additionalImageFiles') || [];
		setValue('additionalImageFiles', [...currentFiles, ...newFiles], { shouldValidate: true });
	};

	const removeAdditionalImage = (index: number) => {
		setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
		const currentFiles = getValues('additionalImageFiles') || [];
		setValue(
			'additionalImageFiles',
			currentFiles.filter((_, i) => i !== index),
			{ shouldValidate: true },
		);
	};

	return (
		<>
			{/* 대표 사진 */}
			<FormImageUpload
				ref={representativeImageRef}
				variant="form"
				shape="square"
				previewImage={previewImage}
				onImageChange={handleImageChange}
				onRemoveImage={removeRepresentativeImage}
				label="클래스 대표 사진 (썸네일)"
				description="클래스를 대표할 사진을 선택해주세요 (4.5MB 이하)"
			/>

			{/* 추가 이미지 */}
			<FormImageUpload
				ref={additionalImagesRef}
				variant="multiple"
				shape="square"
				previewImages={additionalImages}
				onImagesChange={handleAdditionalImagesChange}
				onRemoveImage={removeAdditionalImage}
				label="추가 이미지 (선택)"
				description="클래스를 소개할 추가 이미지를 업로드하세요 (최대 5장)"
				maxImages={5}
			/>
		</>
	);
}

export { fetchAndSetDuplicateImage };
