import * as z from 'zod';

import type { Level } from '@/models/lesson.model';

export const classSchema = z.object({
	title: z.string().min(1, '클래스명을 입력해주세요').max(100, '100자 이내로 입력해주세요'),
	description: z
		.string()
		.min(1, '클래스 소개를 입력해주세요')
		.max(4000, '4000자 이내로 입력해주세요'),
	curriculum: z
		.string()
		.min(40, '커리큘럼은 40자 이상 입력해주세요')
		.max(600, '600자 이내로 입력해주세요'),
	classCategoryId: z.number({ message: '대분류 카테고리를 선택해주세요' }).min(1),
	subCategoryIds: z.array(z.number()).min(1, '소분류 카테고리를 최소 1개 선택해주세요'),
	level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'], { message: '난이도를 선택해주세요' }),
	duration: z.number().min(30, '최소 30분 이상').max(480, '최대 8시간까지'),
	price: z.number().min(0, '가격을 입력해주세요'),
	discountRate: z.number().min(0).max(100),
	maxParticipants: z.number().min(1, '최소 1명 이상').max(50, '최대 50명까지'),
	regionId: z.number().min(1, '지역을 선택해주세요'),
	address: z.string().min(1, '클래스 장소를 입력해주세요'),
	latitude: z.number(),
	longitude: z.number(),
	detailAddress: z.string().optional(),
	directionsText: z.string().optional(),
	reservationLeadDays: z.number().min(0).max(10),
	representativeImageFile: z.instanceof(File).optional(),
	additionalImageFiles: z.array(z.instanceof(File)).optional(),
});

export type ClassFormValues = z.infer<typeof classSchema>;

export const LEVEL_OPTIONS: { value: Level; label: string; description: string }[] = [
	{ value: 'BEGINNER', label: '초급', description: '처음 시작하는 분들을 위한' },
	{ value: 'INTERMEDIATE', label: '중급', description: '기본기가 있는 분들을 위한' },
	{ value: 'ADVANCED', label: '고급', description: '전문적인 실력 향상을 위한' },
];
