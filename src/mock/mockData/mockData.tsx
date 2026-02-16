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
		name: '?�간관�?친목)',
	},
	{
		id: 2,
		name: '���',
	},
	{
		id: 3,
		name: '?�기계발/공�?',
	},
	{
		id: 4,
		name: '?�술',
	},
	{
		id: 5,
		name: '?�포�??�동',
	},
	{
		id: 6,
		name: '?�식',
	},
	{
		id: 7,
		name: '������',
	},
	{
		id: 8,
		name: '����/�����',
	},
	{
		id: 9,
		name: '�?글?�기/?�서',
	},
	{
		id: 10,
		name: '�??�료',
	},
	{
		id: 11,
		name: '커리??직장',
	},
	{
		id: 12,
		name: '�м�',
	},
	{
		id: 13,
		name: '반려?�물',
	},
	{
		id: 14,
		name: '게임/?�티비티',
	},
	{
		id: 15,
		name: '?�행',
	},
	{
		id: 16,
		name: '?�리/?�담',
	},
	{
		id: 17,
		name: '���׸���/����',
	},
	{
		id: 18,
		name: '건강',
	},
	{
		id: 19,
		name: '?�경',
	},
	{
		id: 20,
		name: '?�터',
	},
	{
		id: 21,
		name: '미용',
	},
	{
		id: 22,
		name: 'Ʈ����',
	},
	{
		id: 23,
		name: '����/�̼�����',
	},
	{
		id: 24,
		name: '?�물/?�연',
	},
];

export const mockMeetings: Meeting[] = Array.from({ length: 25 }, (_, i) => {
	const interest = interestCategories[i % interestCategories.length];
	return {
		meetingId: i + 1,
		title: `모임 ?�목 ${i + 1}`,
		meetingImage:
			interestImageMap[interest.name] || faker.image.urlLoremFlickr({ category: 'meeting' }),
		interestId: interest.id,
		interestName: interest.name,
		maxParticipants: 10,
		currentParticipants: i % 10,
		address: `?�울??강남�???��??${i + 1}번�?`,
		meetingDate: `2024-03-${String((i % 28) + 1).padStart(2, '0')}T1${i % 9}:00:00`,
	};
});

// Mock ?�데?�클?�스 ?�이??
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

		title: `${selectedClassCategory.name} ?�데???�래??${i + 1}`,
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
		address: `?�울??${selectedRegion} ${faker.location.city()} ${faker.location.streetAddress()}`,
		latitude: faker.location.latitude(),
		longitude: faker.location.longitude(),
		detailAddress: `${faker.number.int({ min: 1, max: 20 })}�� ${faker.number.int({ min: 101, max: 999 })}ȣ`,
		directionsText: '����ö 2ȣ�� ������ 3�� �ⱸ���� ���� 5��',

		reservationLeadDays: faker.number.int({ min: 0, max: 7 }),

		rate: faker.number.float({ min: 3.0, max: 5.0, fractionDigits: 1 }),

		reviewAiSummary: faker.datatype.boolean() ? faker.lorem.sentence() : null,
		deletedAt: null, // null�?명시
		createdAt: faker.date.recent().toISOString(),
		updatedAt: faker.date.recent().toISOString(),

		teacher: teacherProfile,
		subCategories: selectedSubCategories,
		schedules: schedules,

		isLiked: faker.datatype.boolean(), // ?�론???�용
	};
});

// Mock 리뷰 ?�이??
export const mockReviews: Review[] = mockLessons.flatMap((lesson) =>
	Array.from({ length: faker.number.int({ min: 0, max: 10 }) }, () => {
		const userProfile: UserProfileForReview = {
			id: faker.number.int({ min: 1, max: 1000 }),
			nickname: faker.person.fullName(),
			profileImage: faker.image.avatar(),
		};

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
			content: faker.lorem.paragraphs(faker.number.int({ min: 1, max: 4 })),
			createdAt: faker.date.recent().toISOString(),
			updatedAt: faker.date.recent().toISOString(),
		};
	}),
);

// ??참여모임
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

// ?�모???�청??
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
	...mockLessons[0], // 기본 ?�이?�는 mockLessons??첫번�??�이?�을 ?�사??

	// ?�세 ?�이지?�만 ?�요??images ?�드 추�?
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

	// ?�세 ?�이지?�만 ?�요??reviews ?�드 추�? (mockReviews?�서 ?�당 ?�슨??리뷰?�을 ?�터�?
	reviews: mockReviews.filter((review) => review.lessonId === mockLessons[0].id),
};
