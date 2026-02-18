/**
 * 이미지 경로 유틸리티
 * Next.js와 Vite 환경 모두에서 이미지 경로를 올바르게 처리합니다.
 *
 * - Next.js: 이미지 import 시 { src: string, width: number, height: number, ... } 객체 반환
 * - Vite: 이미지 import 시 문자열 경로 반환
 */

export type ImageImport = string | { src: string; width?: number; height?: number };

/**
 * 이미지 import에서 실제 경로 문자열을 추출합니다.
 *
 * @param image - import한 이미지 (문자열 또는 객체)
 * @returns 이미지 경로 문자열
 */
export const getImageSrc = (image: ImageImport): string => {
	if (typeof image === 'string') {
		return image;
	}
	return image.src;
};
