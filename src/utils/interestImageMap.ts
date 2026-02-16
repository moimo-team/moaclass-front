// src/lib/interestImageMap.ts

// 이미지 명시적 import (Next.js 호환)
import interest1 from '@/assets/images/interests/interest_1.webp';
import interest10 from '@/assets/images/interests/interest_10.webp';
import interest11 from '@/assets/images/interests/interest_11.webp';
import interest12 from '@/assets/images/interests/interest_12.webp';
import interest13 from '@/assets/images/interests/interest_13.webp';
import interest14 from '@/assets/images/interests/interest_14.webp';
import interest15 from '@/assets/images/interests/interest_15.webp';
import interest16 from '@/assets/images/interests/interest_16.webp';
import interest17 from '@/assets/images/interests/interest_17.webp';
import interest18 from '@/assets/images/interests/interest_18.webp';
import interest19 from '@/assets/images/interests/interest_19.webp';
import interest2 from '@/assets/images/interests/interest_2.webp';
import interest20 from '@/assets/images/interests/interest_20.webp';
import interest21 from '@/assets/images/interests/interest_21.webp';
import interest22 from '@/assets/images/interests/interest_22.webp';
import interest23 from '@/assets/images/interests/interest_23.webp';
import interest24 from '@/assets/images/interests/interest_24.webp';
import interest3 from '@/assets/images/interests/interest_3.webp';
import interest4 from '@/assets/images/interests/interest_4.webp';
import interest5 from '@/assets/images/interests/interest_5.webp';
import interest6 from '@/assets/images/interests/interest_6.webp';
import interest7 from '@/assets/images/interests/interest_7.webp';
import interest8 from '@/assets/images/interests/interest_8.webp';
import interest9 from '@/assets/images/interests/interest_9.webp';

import { getImageSrc } from './imageUtils';

// 관심사 이름 목록 (순서 중요: interest_1.webp ~ interest_24.webp 와 매핑됨)
const INTEREST_NAMES = [
	'인간관계(친목)',
	'술',
	'자기계발/공부',
	'예술',
	'스포츠/운동',
	'음식',
	'라이프',
	'공예/만들기',
	'책/글쓰기/독서',
	'차/음료',
	'커리어/직장',
	'재테크',
	'반려동물',
	'게임/액티비티',
	'여행',
	'심리/상담',
	'인테리어/가구',
	'건강',
	'환경',
	'엔터',
	'미용',
	'트렌드',
	'연애/이성관계',
	'식물/자연',
];

// 이미지 배열 (import한 이미지들)
const INTEREST_IMAGES = [
	interest1,
	interest2,
	interest3,
	interest4,
	interest5,
	interest6,
	interest7,
	interest8,
	interest9,
	interest10,
	interest11,
	interest12,
	interest13,
	interest14,
	interest15,
	interest16,
	interest17,
	interest18,
	interest19,
	interest20,
	interest21,
	interest22,
	interest23,
	interest24,
];

export const interestImageMap: { [key: string]: string } = INTEREST_NAMES.reduce(
	(acc, name, index) => {
		acc[name] = getImageSrc(INTEREST_IMAGES[index]);
		return acc;
	},
	{} as Record<string, string>,
);

export const getInterestImageUrl = (interestName: string): string => {
	return interestImageMap[interestName];
};
