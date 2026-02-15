import { fakerKO as faker } from '@faker-js/faker';

import type { MyMeetingsResponse } from '@/api/me.api';
import { LESSON_CATEGORIES, LESSON_SUB_CATEGORIES } from '@/mock/mockData/categoryMock';
import type { Interest } from '@/models/interest.model';
import type { Lesson, Level, TeacherProfile, LessonDetail } from '@/models/lesson.model';
import type { Meeting } from '@/models/meeting.model';
import type { ParticipationDetail, ParticipationStatus } from '@/models/participation.model';
import type { Review, UserProfileForReview } from '@/models/review.model';
import { interestImageMap } from '@/utils/interestImageMap';

export const httpUrl = import.meta.env.VITE_API_URL || 'https://moimo-back.vercel.app';

export const interestCategories: Interest[] = [
	{
		id: 1,
		name: '인간관계(친목)',
	},
	{
		id: 2,
		name: '술',
	},
	{
		id: 3,
		name: '자기계발/공부',
	},
	{
		id: 4,
		name: '예술',
	},
	{
		id: 5,
		name: '스포츠/운동',
	},
	{
		id: 6,
		name: '음식',
	},
	{
		id: 7,
		name: '라이프',
	},
	{
		id: 8,
		name: '공예/만들기',
	},
	{
		id: 9,
		name: '책/글쓰기/독서',
	},
	{
		id: 10,
		name: '차/음료',
	},
	{
		id: 11,
		name: '커리어/직장',
	},
	{
		id: 12,
		name: '재테크',
	},
	{
		id: 13,
		name: '반려동물',
	},
	{
		id: 14,
		name: '게임/액티비티',
	},
	{
		id: 15,
		name: '여행',
	},
	{
		id: 16,
		name: '심리/상담',
	},
	{
		id: 17,
		name: '인테리어/가구',
	},
	{
		id: 18,
		name: '건강',
	},
	{
		id: 19,
		name: '환경',
	},
	{
		id: 20,
		name: '엔터',
	},
	{
		id: 21,
		name: '미용',
	},
	{
		id: 22,
		name: '트렌드',
	},
	{
		id: 23,
		name: '연애/이성관계',
	},
	{
		id: 24,
		name: '식물/자연',
	},
];

export const mockMeetings: Meeting[] = Array.from({ length: 25 }, (_, i) => {
	const interest = interestCategories[i % interestCategories.length];
	return {
		meetingId: i + 1,
		title: `모임 제목 ${i + 1}`,
		meetingImage:
			interestImageMap[interest.name] || faker.image.urlLoremFlickr({ category: 'meeting' }),
		interestId: interest.id,
		interestName: interest.name,
		maxParticipants: 10,
		currentParticipants: i % 10,
		address: `서울시 강남구 역삼동 ${i + 1}번지`,
		meetingDate: `2024-03-${String((i % 28) + 1).padStart(2, '0')}T1${i % 9}:00:00`,
	};
});

// Mock 원데이클래스 데이터
export const mockLessons: Lesson[] = Array.from({ length: 15 }, (_, i) => {
	const selectedClassCategory = faker.helpers.arrayElement(LESSON_CATEGORIES);
	const selectedRegion = faker.location.county();

	const teacherProfile: TeacherProfile = {
		id: faker.number.int({ min: 1, max: 100 }),
		userId: faker.number.int({ min: 1, max: 100 }),
		nickname: faker.person.fullName(),
		image: faker.image.avatar(),
		introduction: faker.lorem.paragraph(),
	};

	const numberOfSubCategories = faker.number.int({ min: 0, max: 3 });
	const selectedSubCategories = faker.helpers
		.arrayElements(
			LESSON_SUB_CATEGORIES.filter((sub) => sub.categoryId === selectedClassCategory.id),
			numberOfSubCategories,
		)
		.map((sub) => ({
			id: sub.id,
			name: sub.name,
		}));

	const lessonLevels: Level[] = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
	const basePrice = faker.number.int({ min: 30000, max: 100000 });
	const discountRate = faker.number.int({ min: 0, max: 30 });

	const schedules = Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => {
		const start = faker.date.soon({ days: 30 });
		const end = new Date(start.getTime() + faker.number.int({ min: 60, max: 240 }) * 60 * 1000);
		return {
			id: faker.number.int({ min: 1, max: 1000 }),
			startAt: start.toISOString(),
			endAt: end.toISOString(),
			status: faker.helpers.arrayElement(['RECRUITING', 'CLOSED', 'COMPLETED']),
			currentParticipants: faker.number.int({ min: 0, max: 5 }),
		};
	});

	return {
		id: i + 1,
		userId: teacherProfile.userId,
		lessonCategoryId: selectedClassCategory.id,
		lessonCategoryName: selectedClassCategory.name,

		title: `${selectedClassCategory.name} 원데이 클래스 ${i + 1}`,
		description: faker.lorem.paragraph(),
		curriculum: faker.lorem.paragraphs(2),

		level: lessonLevels[i % lessonLevels.length],
		durationMin: faker.number.int({ min: 60, max: 240 }),

		status: 'ACTIVE',
		price: basePrice,
		discountRate: discountRate,
		discountedPrice: Math.floor(basePrice * (1 - discountRate / 100)),
		maxParticipants: faker.number.int({ min: 5, max: 20 }),

		representativeImage:
			interestImageMap[selectedClassCategory.name] ||
			faker.image.urlLoremFlickr({ category: 'class' }),
		likeCount: faker.number.int({ min: 0, max: 500 }),

		regionId: faker.number.int({ min: 1, max: 10 }),
		regionName: selectedRegion,
		address: `서울시 ${selectedRegion} ${faker.location.city()} ${faker.location.streetAddress()}`,
		latitude: faker.location.latitude(),
		longitude: faker.location.longitude(),
		detailAddress: `${faker.number.int({ min: 1, max: 20 })}층 ${faker.number.int({ min: 101, max: 999 })}호`,
		directionsText: '지하철 2호선 강남역 3번 출구에서 도보 5분',

		reservationLeadDays: faker.number.int({ min: 0, max: 7 }),

		rate: faker.number.float({ min: 3.0, max: 5.0, fractionDigits: 1 }),

		reviewAiSummary: faker.datatype.boolean() ? faker.lorem.sentence() : null,
		deletedAt: null, // null로 명시
		createdAt: faker.date.recent().toISOString(),
		updatedAt: faker.date.recent().toISOString(),

		teacher: teacherProfile,
		subCategories: selectedSubCategories,
		schedules: schedules,

		isLiked: faker.datatype.boolean(), // 프론트 전용
	};
});

// Mock 리뷰 데이터
export const mockReviews: Review[] = mockLessons.flatMap((lesson) =>
	Array.from({ length: faker.number.int({ min: 0, max: 10 }) }, () => {
		const userProfile: UserProfileForReview = {
			id: faker.number.int({ min: 1, max: 1000 }),
			nickname: faker.person.fullName(),
			profileImage: faker.image.avatar(),
		};

		const reviewId = faker.number.int({ min: 1000, max: 9999 });

		const representativeImage = faker.datatype.boolean()
			? faker.image.urlLoremFlickr({
					category: 'food',
					width: 400,
					height: 300,
				})
			: null;

		return {
			id: faker.number.int({ min: 1000, max: 9999 }),
			user: userProfile,
			lessonId: lesson.id,
			rating: faker.number.float({ min: 1.0, max: 5.0 }),
			representativeImage,
			images: representativeImage ? [representativeImage] : [],
			content: faker.lorem.paragraphs(faker.number.int({ min: 1, max: 4 })),
			createdAt: faker.date.recent().toISOString(),
			updatedAt: faker.date.recent().toISOString(),
		};
	}),
);

// 내 참여모임
export const myMeetings: MyMeetingsResponse[] = Array.from({ length: 60 }, (_, i) => {
	const isHost = i % 3 === 0;
	const isCompleted = i % 2 === 0;
	const status: ParticipationStatus =
		i % 4 === 0 ? 'PENDING' : i % 5 === 0 ? 'REJECTED' : 'ACCEPTED';
	const interest = interestCategories[i % interestCategories.length];

	return {
		meetingId: 101 + i,
		title: faker.company.catchPhrase(),
		meetingImage: faker.image.urlLoremFlickr({ category: 'meeting' }),
		interestId: interest.id,
		interestName: interest.name,
		address: `${faker.location.city()} ${faker.location.street()}`,
		meetingDate: faker.date.future().toISOString(),
		currentParticipants: faker.number.int({ min: 1, max: 10 }),
		maxParticipants: faker.number.int({ min: 10, max: 20 }),
		status,
		isHost,
		isCompleted,
	};
});

// 내모임 신청자
export const mockParticipants: Record<number, ParticipationDetail[]> = myMeetings.reduce(
	(acc, meeting) => {
		acc[meeting.meetingId] = Array.from({ length: meeting.currentParticipants }, (_, i) => ({
			participationId: meeting.meetingId * 100 + i,
			userId: 1000 + i,
			nickname: faker.person.lastName() + faker.person.firstName(),
			profileImage: faker.image.avatar(),
			status: i === 0 && meeting.isHost ? 'ACCEPTED' : i % 5 === 0 ? 'PENDING' : 'ACCEPTED',
			bio: faker.person.bio(),
			interests: faker.helpers.arrayElements(interestCategories, {
				min: 1,
				max: 3,
			}),
		}));
		return acc;
	},
	{} as Record<number, ParticipationDetail[]>,
);

export const mockLessonDetail: LessonDetail = {
	...mockLessons[0], // 기본 데이터는 mockLessons의 첫번째 아이템을 재사용

	// 상세 페이지에만 필요한 images 필드 추가
	images: Array.from({ length: faker.number.int({ min: 3, max: 6 }) }, (_, i) => ({
		id: 200 + i,
		lessonId: mockLessons[0].id,
		image: faker.image.urlLoremFlickr({
			category: 'art',
			width: 800,
			height: 600,
		}),
		sequence: i + 1,
	})),

	// 상세 페이지에만 필요한 reviews 필드 추가 (mockReviews에서 해당 레슨의 리뷰들을 필터링)
	reviews: mockReviews.filter((review) => review.lessonId === mockLessons[0].id),
};
