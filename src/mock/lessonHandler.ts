import { http, HttpResponse, delay } from 'msw';

import { LESSON_SUB_CATEGORIES } from '@/mock/mockData/categoryMock';
import { httpUrl, mockLessonDetail, mockLessons, mockReviews } from '@/mock/mockData/mockData';
import type { Level, Lesson } from '@/models/lesson.model';
import type { FetchLessonsResponse } from '@/models/lesson.model';

import { isLessonLiked } from './likeHandler';

const toNullableImage = (image: string | undefined): string | null => image ?? null;

const applyLikeStatus = (lessons: Lesson[]): Lesson[] => {
	return lessons.map((lesson) => ({
		...lesson,
		isLiked: isLessonLiked(lesson.id),
	}));
};

export const lessonHandlers = [
	http.get(`${httpUrl}/lessons`, async ({ request }) => {
		await delay(500);

		const url = new URL(request.url);
		const page = Number(url.searchParams.get('page') || '1');
		const limit = Number(url.searchParams.get('limit') || '12');

		// filterStore에서 보내는 파라미터 키와 일치시킴
		const categoryId = Number(url.searchParams.get('categoryId') || '0');
		const regionIds = url.searchParams.getAll('regionId').map(Number);
		const levels = url.searchParams.getAll('level') as Level[];
		const timeRange = url.searchParams.get('timeRange');
		const minPrice = Number(url.searchParams.get('minPrice') || '0');
		const maxPrice = Number(url.searchParams.get('maxPrice') || '500000');
		const maxParticipants = Number(url.searchParams.get('maxParticipants') || '0');
		const sort = url.searchParams.get('sort') || 'LATEST';

		const filteredLessons = mockLessons
			.filter((lesson) => {
				if (!categoryId) return true;
				return lesson.lessonCategoryId === categoryId;
			})
			.filter((lesson) => {
				if (regionIds.length === 0) return true;
				return regionIds.includes(lesson.regionId);
			})
			.filter((lesson) => {
				if (levels.length === 0) return true;
				return levels.includes(lesson.level);
			})
			.filter((lesson) => {
				if (!maxParticipants) return true;
				return lesson.maxParticipants >= maxParticipants;
			})
			.filter((lesson) => {
				if (!timeRange) return true;
				const [min, max] = timeRange.split('-').map(Number);
				// 스케줄의 시작/종료 시간을 기준으로 필터링
				return lesson.schedules.some((schedule) => {
					const scheduleStartHour = new Date(schedule.startAt).getHours();
					const scheduleEndHour = new Date(schedule.endAt).getHours();
					return scheduleStartHour >= min && scheduleEndHour <= max;
				});
			})
			.filter((lesson) => {
				if (minPrice === 0 && maxPrice === 500000) return true;
				return lesson.discountedPrice >= minPrice && lesson.discountedPrice <= maxPrice;
			});

		const lessonsWithTimestamp = filteredLessons.map((lesson) => {
			if (lesson.schedules.length === 0) {
				return { ...lesson, earliestTimestamp: Infinity }; // 스케줄이 없으면 무한대로 설정
			}
			const earliestSchedule = lesson.schedules.reduce((min, s) =>
				new Date(s.startAt) < new Date(min.startAt) ? s : min,
			);
			return {
				...lesson,
				earliestTimestamp: new Date(earliestSchedule.startAt).getTime(),
			};
		});

		const sortedLessons = [...lessonsWithTimestamp].sort((a, b) => {
			switch (sort) {
				case 'PRICE_ASC':
					return a.discountedPrice - b.discountedPrice;
				case 'PRICE_DESC':
					return b.discountedPrice - a.discountedPrice;
				case 'DEADLINE':
					return a.earliestTimestamp - b.earliestTimestamp;
				case 'UPDATE':
					return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
				case 'RATE':
					return b.rate - a.rate;
				case 'LIKES':
					return b.likeCount - a.likeCount;
				case 'LATEST':
				default:
					return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
			}
		});

		const totalCount = sortedLessons.length;
		const totalPages = Math.ceil(totalCount / limit);
		const paginatedLessons = sortedLessons.slice((page - 1) * limit, page * limit);

		const paginatedLessonsWithStatus = applyLikeStatus(paginatedLessons);

		return HttpResponse.json(
			{
				data: paginatedLessonsWithStatus,
				meta: {
					totalCount,
					page,
					limit,
					totalPages,
				},
			} as FetchLessonsResponse,
			{ status: 200 },
		);
	}),

	http.get(`${httpUrl}/lessons/:lessonId`, async ({ params }) => {
		await delay(500);
		const lessonId = Number(params.lessonId);

		if (mockLessonDetail) {
			const lessonDetailWithStatus = {
				...mockLessonDetail,
				id: lessonId,
				isLiked: isLessonLiked(lessonId),
			};
			return HttpResponse.json(lessonDetailWithStatus, { status: 200 });
		} else {
			return HttpResponse.json(
				{ message: '상세 목 데이터를 찾을 수 없습니다.' },
				{ status: 404 },
			);
		}
	}),

	// 클래스 리뷰 목록
	http.get(`${httpUrl}/lessons/:lessonId/reviews`, async ({ params, request }) => {
		await delay(300);
		const url = new URL(request.url);
		const lessonId = Number(params.lessonId);
		const page = Number(url.searchParams.get('page') || '1');
		const limit = Number(url.searchParams.get('limit') || '6');

		const lessonTitle =
			mockLessons.find((lesson) => lesson.id === lessonId)?.title || '레슨 타이틀';

		const filteredReviews = mockReviews
			.filter((review) => review.lessonId === lessonId)
			.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

		const totalCount = filteredReviews.length;
		const totalPages = Math.ceil(totalCount / limit);
		const paginated = filteredReviews.slice((page - 1) * limit, page * limit);

		const data = paginated.map((review) => {
			const images = review.representativeImage ? [review.representativeImage] : [];
			return {
				id: review.id,
				lessonId: review.lessonId,
				lessonTitle,
				userId: review.user.id,
				rating: review.rating,
				content: review.content,
				image1: toNullableImage(images[0]),
				image2: toNullableImage(images[1]),
				image3: toNullableImage(images[2]),
				image4: toNullableImage(images[3]),
				image5: toNullableImage(images[4]),
				image6: toNullableImage(images[5]),
				image7: toNullableImage(images[6]),
				image8: toNullableImage(images[7]),
				createdAt: review.createdAt,
				updatedAt: review.updatedAt,
			};
		});

		return HttpResponse.json(
			{
				data,
				meta: {
					totalCount,
					page,
					limit,
					totalPages,
				},
			},
			{ status: 200 },
		);
	}),

	// 클래스 생성
	http.post(`${httpUrl}/lessons`, async ({ request }) => {
		await delay(1000);
		const formData = await request.formData();

		// FormData에서 데이터 추출
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;
		const curriculum = formData.get('curriculum') as string;
		const lessonCategoryId = Number(formData.get('lessonCategoryId'));
		const lessonCategoryName = formData.get('lessonCategoryName') as string;
		const subCategoryIdsStr = formData.get('subCategoryIds') as string;
		const subCategories = subCategoryIdsStr
			? JSON.parse(subCategoryIdsStr).map((id: number) => {
					const sub = LESSON_SUB_CATEGORIES.find((s) => s.id === id);
					return sub ? { id: sub.id, name: sub.name } : undefined;
				})
			: [];
		const level = formData.get('level') as Level;
		const durationMin = Number(formData.get('durationMin'));
		const price = Number(formData.get('price'));
		const discountRate = Number(formData.get('discountRate'));
		const discountedPrice = Number(formData.get('discountedPrice'));
		const maxParticipants = Number(formData.get('maxParticipants'));
		const regionId = Number(formData.get('regionId'));
		const regionName = formData.get('regionName') as string;
		const address = formData.get('address') as string;
		const latitude = Number(formData.get('latitude'));
		const longitude = Number(formData.get('longitude'));
		const detailAddress = (formData.get('detailAddress') as string) || '';
		const directionsText = (formData.get('directionsText') as string) || '';
		const reservationLeadDays = Number(formData.get('reservationLeadDays'));
		const teacherId = Number(formData.get('userId'));
		const teacherNickname = formData.get('teacherNickname') as string;
		const schedulesStr = formData.get('schedules') as string;
		const schedules = schedulesStr ? JSON.parse(schedulesStr) : [];

		// 새 클래스 ID 생성
		const newId = Math.max(...mockLessons.map((l) => l.id), 0) + 1;

		// 새 클래스 객체 생성
		const newLesson: Lesson = {
			id: newId,
			userId: teacherId,
			lessonCategoryId: lessonCategoryId,
			lessonCategoryName: lessonCategoryName,
			title,
			description,
			curriculum,
			level,
			durationMin,
			status: 'ACTIVE',
			price,
			discountRate,
			discountedPrice,
			maxParticipants,
			representativeImage: 'https://placehold.co/600x400?text=New+Class',
			likeCount: 0,
			regionId,
			regionName,
			address,
			latitude,
			longitude,
			detailAddress,
			directionsText,
			reservationLeadDays,
			rate: 0,
			deletedAt: null,
			reviewAiSummary: null,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			teacher: {
				id: teacherId,
				userId: teacherId,
				nickname: teacherNickname,
				image: 'https://placehold.co/40x40?text=Teacher',
				introduction: '안녕하세요! 여러분의 모멘토입니다. 함께 즐거운 시간을 보내봐요!',
			},
			subCategories: subCategories,
			schedules: schedules,
		};

		// mockLessons 배열 맨 앞에 추가
		mockLessons.unshift(newLesson);

		console.log('✅ Mock Lesson Created:', newLesson);
		console.log('📋 Total Lessons:', mockLessons.length);

		return HttpResponse.json(
			{
				id: newId,
				message: '클래스가 성공적으로 생성되었습니다. (Mock)',
			},
			{ status: 201 },
		);
	}),

	// 클래스 수정
	http.put(`${httpUrl}/lessons/:lessonId`, async ({ params, request }) => {
		await delay(1000);
		const lessonId = Number(params.lessonId);
		const formData = await request.formData();

		// FormData에서 데이터 추출
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;
		const curriculum = formData.get('curriculum') as string;
		const lessonCategoryId = Number(formData.get('lessonCategoryId'));
		const lessonCategoryName = formData.get('lessonCategoryName') as string;
		const subCategoryIdsStr = formData.get('subCategoryIds') as string;
		const subCategories = subCategoryIdsStr
			? JSON.parse(subCategoryIdsStr).map((id: number) => {
					const sub = LESSON_SUB_CATEGORIES.find((s) => s.id === id);
					return sub ? { id: sub.id, name: sub.name } : undefined;
				})
			: [];
		const level = formData.get('level') as Level;
		const durationMin = Number(formData.get('durationMin'));
		const price = Number(formData.get('price'));
		const discountRate = Number(formData.get('discountRate'));
		const discountedPrice = Number(formData.get('discountedPrice'));
		const maxParticipants = Number(formData.get('maxParticipants'));
		const regionId = Number(formData.get('regionId'));
		const regionName = formData.get('regionName') as string;
		const address = formData.get('address') as string;
		const latitude = Number(formData.get('latitude'));
		const longitude = Number(formData.get('longitude'));
		const detailAddress = (formData.get('detailAddress') as string) || '';
		const directionsText = (formData.get('directionsText') as string) || '';
		const reservationLeadDays = Number(formData.get('reservationLeadDays'));
		const teacherId = Number(formData.get('userId'));
		const teacherNickname = formData.get('teacherNickname') as string;
		const schedulesStr = formData.get('schedules') as string;
		const schedules = schedulesStr ? JSON.parse(schedulesStr) : [];

		// 기존 클래스 찾기
		const lessonIndex = mockLessons.findIndex((l) => l.id === lessonId);

		if (lessonIndex !== -1) {
			// 클래스 업데이트
			mockLessons[lessonIndex] = {
				...mockLessons[lessonIndex],
				userId: teacherId,
				lessonCategoryId,
				lessonCategoryName,
				title,
				description,
				curriculum,
				level,
				durationMin,
				price,
				discountRate,
				discountedPrice,
				maxParticipants,
				regionId,
				regionName,
				address,
				latitude,
				longitude,
				detailAddress,
				directionsText,
				reservationLeadDays,
				updatedAt: new Date().toISOString(),
				teacher: {
					id: teacherId,
					userId: teacherId,
					nickname: teacherNickname,
					image: 'https://placehold.co/40x40?text=Teacher',
					introduction: '안녕하세요! 여러분의 모멘토입니다. 함께 즐거운 시간을 보내봐요!',
				},
				subCategories: subCategories,
				schedules: schedules,
			};

			console.log('✅ Mock Lesson Updated:', mockLessons[lessonIndex]);

			return HttpResponse.json(
				{
					id: lessonId,
					message: '클래스가 성공적으로 수정되었습니다. (Mock)',
				},
				{ status: 200 },
			);
		} else {
			return HttpResponse.json(
				{
					message: '클래스를 찾을 수 없습니다.',
				},
				{ status: 404 },
			);
		}
	}),

	// 클래스 삭제
	http.delete(`${httpUrl}/lessons/:lessonId`, async ({ params }) => {
		await delay(500);
		const lessonId = Number(params.lessonId);

		const lessonIndex = mockLessons.findIndex((l) => l.id === lessonId);

		if (lessonIndex !== -1) {
			// mockLessons 배열에서 제거
			mockLessons.splice(lessonIndex, 1);

			console.log(`✅ Mock Lesson Deleted: ID ${lessonId}`);
			console.log(`✅ Remaining Lessons: ${mockLessons.length}`);

			return HttpResponse.json(
				{
					message: '클래스가 삭제되었습니다. (Mock)',
				},
				{ status: 200 },
			);
		} else {
			return HttpResponse.json(
				{
					message: '클래스를 찾을 수 없습니다.',
				},
				{ status: 404 },
			);
		}
	}),
];
