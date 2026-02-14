import { http, HttpResponse, delay } from 'msw';

import { httpUrl } from './mockData/mockData';
import { WishlistLessons } from './mockData/wishlistMock';

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

	const filteredLessons = WishlistLessons;

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
const addLike = http.post(`${httpUrl}/likes/:lessonId`, async ({ request, params }) => {
	await delay(500);

	const token = request.headers.get('Authorization');
	if (!token) {
		return HttpResponse.json({ message: '토큰이 없습니다.' }, { status: 401 });
	}

	const { lessonId } = params;
	const targetId = Number(lessonId);

	const exists = WishlistLessons.some((lesson) => lesson.lessonId === targetId);

	if (exists) {
		return HttpResponse.json(
			{ message: '이미 위시리스트에 존재하는 클래스입니다.' },
			{ status: 409 },
		);
	}

	WishlistLessons.push({
		lessonId: Number(lessonId),
		title: '새로운 클래스',
		price: 10000,
		category: {
			id: 1,
			name: '프로그래밍',
		},
		image: 'https://example.com/image.jpg',
		teacherNickname: '새로운 강사',
		region: {
			id: 1,
			name: '서울시',
		},
		address: '서울시 강남구 역삼동 123-45',
		discountRate: 0,
		discountedPrice: 10000,
		likes: 1,
		rate: 5,
	});

	return HttpResponse.json({ message: '위시리스트에 추가되었습니다.' }, { status: 200 });
});

// 좋아요 취소
const cancelLike = http.delete(`${httpUrl}/likes/:lessonId`, async ({ request, params }) => {
	await delay(500);

	const token = request.headers.get('Authorization');
	if (!token) {
		return HttpResponse.json({ message: '토큰이 없습니다.' }, { status: 401 });
	}

	const { lessonId } = params;
	const index = WishlistLessons.findIndex((lesson) => lesson.lessonId === Number(lessonId));

	if (index === -1) {
		return HttpResponse.json({ message: '위시리스트에 없는 클래스입니다.' }, { status: 404 });
	}

	WishlistLessons.splice(index, 1);

	return HttpResponse.json({ message: '위시리스트에서 삭제되었습니다.' }, { status: 200 });
});

export const likeHandlers = [getWishlist, addLike, cancelLike];

export const isLessonLiked = (lessonId: number) =>
	WishlistLessons.some((lesson) => lesson.lessonId === lessonId);
