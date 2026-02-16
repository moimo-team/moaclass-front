import { http, HttpResponse, delay } from 'msw';

import type { ReviewInfo } from '@/models/review.model';

import { httpUrl, mockLessons, mockReviews } from './mockData/mockData';
import { MOCK_ORDERS } from './mockData/orderMock';
import { mockMyReviews } from './reviewMock';

// 리뷰 작성
const writeReview = http.post(`${httpUrl}/reviews`, async ({ request }) => {
	await delay(500);
	const authHeader = request.headers.get('Authorization');
	if (!authHeader) {
		return HttpResponse.json({ message: '토큰이 없습니다.' }, { status: 401 });
	}

	const formData = await request.formData();
	const lessonId = Number(formData.get('lessonId'));
	const rating = Number(formData.get('rating'));
	const content = formData.get('content') as string;

	// 이미지 처리: image1 ~ image5 추출
	const images: string[] = [];
	for (let i = 1; i <= 5; i++) {
		const imgFile = formData.get(`image${i}`);
		if (imgFile instanceof File) {
			// Mock용 가짜URL 생성
			images.push(`https://placehold.co/400x300?text=Review+Image+${i}`);
		}
	}
	const representativeImage = images[0] || null;

	const id = Math.floor(Math.random() * 10000);
	const newReview: ReviewInfo = {
		id,
		user: {
			id: 1,
			nickname: '??(Mock User)',
			profileImage: null,
		},
		lessonId,
		rating,
		content,
		representativeImage,
		images,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	};

	mockMyReviews.push(newReview);

	// 주문 데이터 연동: 해당 lessonId를 가진 주문의 reviewId 업데이트
	const order = MOCK_ORDERS.find((o) => o.lessonId === lessonId);
	if (order) {
		order.reviewId = id;
	}

	return HttpResponse.json(newReview, { status: 201 });
});

// 내가 작성한 특정 클래스 리뷰 조회
const getMyReview = http.get(`${httpUrl}/reviews/me/:lessonId`, async ({ params }) => {
	await delay(500);
	const lessonId = Number(params.lessonId);

	// 내 리뷰 목록에서 먼저 찾고, 없으면 전체 mockReviews에서 내 ID(1)인 것을 찾음
	const review =
		mockMyReviews.find((r) => r.lessonId === lessonId) ||
		mockReviews.find((r) => r.lessonId === lessonId && r.user.id === 1);

	if (review) {
		return HttpResponse.json(review, { status: 200 });
	}

	return HttpResponse.json(null, { status: 200 });
});

// 리뷰 수정
const updateReview = http.put(`${httpUrl}/reviews/:reviewId`, async ({ params, request }) => {
	await delay(500);
	const { reviewId } = params;
	const formData = await request.formData();
	const rating = formData.get('rating') ? Number(formData.get('rating')) : undefined;
	const content = formData.get('content') as string;

	// 이미지 처리: image1 ~ image5 추출
	const images: string[] = [];
	for (let i = 1; i <= 5; i++) {
		const imgFile = formData.get(`image${i}`);
		if (imgFile instanceof File) {
			images.push(`https://placehold.co/400x300?text=Updated+Image+${i}`);
		}
	}

	// 내 리뷰 목록에서 검색
	let review = mockMyReviews.find((r) => r.id === Number(reviewId));
	if (!review) {
		review = mockReviews.find((r) => r.id === Number(reviewId));
	}

	if (review) {
		if (rating !== undefined) review.rating = rating;
		if (content !== undefined) review.content = content;
		if (images.length > 0) {
			review.representativeImage = images[0];
		}
		review.updatedAt = new Date().toISOString();
		return HttpResponse.json(review, { status: 200 });
	}

	return HttpResponse.json({ message: '리뷰를 찾을 수 없습니다.' }, { status: 404 });
});

const getLatestReviews = http.get(`${httpUrl}/reviews`, async ({ request }) => {
	await delay(500);

	const url = new URL(request.url);
	const page = Number(url.searchParams.get('page') ?? '1');
	const limit = Number(url.searchParams.get('limit') ?? '6');

	const sortedReviews = [...mockReviews].sort(
		(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
	);
	const offset = (page - 1) * limit;
	const pagedReviews = sortedReviews.slice(offset, offset + limit);

	const data = pagedReviews.map((review) => {
		const lesson = mockLessons.find((item) => item.id === review.lessonId);

		return {
			id: review.id,
			lessonId: review.lessonId,
			lessonTitle: lesson?.title ?? `클래스 ${review.lessonId}`,
			userId: review.user.id,
			rating: review.rating,
			content: review.content,
			representativeImage: review.representativeImage,
		};
	});

	return HttpResponse.json(
		{
			data,
			meta: {
				totalCount: sortedReviews.length,
				page,
				limit,
				totalPages: Math.max(1, Math.ceil(sortedReviews.length / limit)),
			},
		},
		{ status: 200 },
	);
});

export const reviewHandler = [writeReview, getMyReview, updateReview, getLatestReviews];
