import type { FetchLessonsResponse, Lesson } from '@/models/lesson.model';

const createLesson = (id: number, title: string): Lesson => ({
	id,
	userId: 1,
	lessonCategoryId: 1,
	lessonCategoryName: '카테고리',
	title,
	description: '설명',
	level: 'BEGINNER',
	durationMin: 60,
	curriculum: '커리큘럼',
	status: 'ACTIVE',
	price: 10000,
	discountRate: 0,
	discountedPrice: 10000,
	maxParticipants: 10,
	representativeImage: '',
	likeCount: 0,
	regionId: 1,
	regionName: '서울',
	address: '서울시',
	latitude: 0,
	longitude: 0,
	detailAddress: '',
	directionsText: '',
	reservationLeadDays: 1,
	rate: 0,
	deletedAt: null,
	reviewAiSummary: null,
	createdAt: '2026-01-01T00:00:00.000Z',
	updatedAt: '2026-01-01T00:00:00.000Z',
	teacher: {
		id: 1,
		nickname: '모멘토',
		image: '',
	},
	subCategories: [],
	schedules: [],
});

export const LESSON_LIST_FIXTURE = [createLesson(1, '클래스 1'), createLesson(2, '클래스 2')];

export const LESSON_LIST_RESPONSE: FetchLessonsResponse = {
	data: LESSON_LIST_FIXTURE,
	meta: {
		totalCount: 2,
		page: 1,
		limit: 10,
		totalPages: 3,
	},
};

export const LESSON_LIST_EMPTY_RESPONSE: FetchLessonsResponse = {
	data: [],
	meta: {
		totalCount: 0,
		page: 1,
		limit: 10,
		totalPages: 0,
	},
};

export const LESSON_SEARCH_PARAMS = new URLSearchParams(
	'categoryId=10&regionId=1&sort=LIKES&page=2&minPrice=10000&maxPrice=50000',
);
