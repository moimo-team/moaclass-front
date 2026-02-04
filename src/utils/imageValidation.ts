/**
 * 이미지 파일 검증 유틸리티
 */

export const MAX_IMAGE_SIZE = 4.5 * 1024 * 1024; // 4.5MB
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
  errorDescription?: string;
}

/**
 * 이미지 파일 유효성 검사
 * @param file - 검증할 파일
 * @returns 검증 결과 객체
 */
export const validateImageFile = (file: File): ImageValidationResult => {
  // 파일 타입 검증
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: "지원하는 이미지 형식만 업로드할 수 있어요",
      errorDescription: "JPG, PNG, WebP, GIF 형식만 가능합니다",
    };
  }

  // Mac NFD 파일명 정규화 및 한글 검증
  const normalizedFileName = file.name.normalize("NFC");
  const hasKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(normalizedFileName);
  if (hasKorean) {
    return {
      isValid: false,
      error: "이미지 파일명이 한글인 경우 업로드할 수 없어요",
      errorDescription: "파일명을 영문으로 변경해주세요",
    };
  }

  // 파일 크기 검증
  if (file.size > MAX_IMAGE_SIZE) {
    return {
      isValid: false,
      error: "이미지 크기가 너무 큽니다",
      errorDescription: "4.5MB 이하의 이미지만 업로드 가능합니다",
    };
  }

  return { isValid: true };
};

/**
 * 파일을 Base64 Data URL로 변환
 * @param file - 변환할 파일
 * @returns Promise<string> - Base64 Data URL
 */
export const fileToDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
