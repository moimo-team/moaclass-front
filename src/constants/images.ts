/**
 * 리뷰 관련 상수
 */

/** 리뷰 이미지 최대 개수 */
export const MAX_REVIEW_IMAGES = 8;

/** 리뷰 이미지 슬롯 번호 배열 (1 ~ MAX_REVIEW_IMAGES) */
export const IMAGE_SLOTS = Array.from({ length: MAX_REVIEW_IMAGES }, (_, i) => i + 1);
