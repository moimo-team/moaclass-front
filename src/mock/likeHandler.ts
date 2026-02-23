import { http, HttpResponse, delay } from 'msw';

import { httpUrl, mockLessons } from './mockData/mockData';

// 위시리스트 조회
const getWishlist = http.get(`${httpUrl}/likes/me`, async ({ request }) => {
	await delay(500);
	const token = request.headers.get('Authorization');
	if (!token) {
		return HttpResponse.json({ message: '토큰이 없습니다.' }, { status: 401 });
	}

	const url = new URL(request.url);
	const page = Number(url.searchParams.get('page') || '1');
	const limit = Number(url.searchParams.get('limit') || '8');

	const filteredLessons = mockLessons.filter((lesson) => lesson.isLiked);

	const totalCount = filteredLessons.length;
	const totalPages = Math.ceil(totalCount / limit);
	const paginatedLessons = filteredLessons.slice((page - 1) * limit, page * limit);

	return HttpResponse.json(
		{
			data: paginatedLessons,
			meta: {
				totalCount,
				page,
				limit,
				totalPages,
			},
		},
		{ status: 200 },
	);
});

// 좋아요 추가
const addLike = http.post(`${httpUrl}/likes`, async ({ request }) => {
	await delay(500);

	const token = request.headers.get('Authorization');
	if (!token) {
		return HttpResponse.json({ message: '토큰이 없습니다.' }, { status: 401 });
	}

	const wishlistLessons = [];
	const { lessonId } = (await request.json()) as any;
	const targetId = Number(lessonId);

	const exists = mockLessons.some((lesson) => lesson.id === targetId);

	if (exists) {
		return HttpResponse.json(
			{ message: '이미 위시리스트에 존재하는 클래스입니다.' },
			{ status: 409 },
		);
	}

	wishlistLessons.push({
		...mockLessons.find((lesson) => lesson.id === targetId),
		isLiked: true,
	});

	return HttpResponse.json({ message: '위시리스트에 추가되었습니다.' }, { status: 200 });
});

// 좋아요 취소
const cancelLike = http.delete(`${httpUrl}/likes`, async ({ request }) => {
	await delay(500);

	const token = request.headers.get('Authorization');
	if (!token) {
		return HttpResponse.json({ message: '토큰이 없습니다.' }, { status: 401 });
	}

	const { lessonId } = (await request.json()) as any;
	const targetId = Number(lessonId);

	const index = mockLessons.findIndex((lesson) => lesson.id === targetId);
	if (index === -1) {
		return HttpResponse.json({ message: '위시리스트에 없는 클래스입니다.' }, { status: 404 });
	}

	mockLessons.splice(index, 1);

	return HttpResponse.json({ message: '위시리스트에서 삭제되었습니다.' }, { status: 200 });
});

export const likeHandlers = [getWishlist, addLike, cancelLike];

export const isLessonLiked = (lessonId: number) =>
	mockLessons.some((lesson) => lesson.id === lessonId);
