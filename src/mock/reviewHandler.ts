import { http, HttpResponse, delay } from 'msw';

import type { ReviewInfo } from '@/models/review.model';

import { httpUrl, mockReviews } from './mockData/mockData';
import { MOCK_ORDERS } from './mockData/orderMock';
import { mockMyReviews } from './reviewMock';

// 리뷰 ?�성
const writeReview = http.post(`${httpUrl}/reviews`, async ({ request }) => {
	await delay(500);
	const authHeader = request.headers.get('Authorization');
	if (!authHeader) {
		return HttpResponse.json({ message: '?�큰???�습?�다.' }, { status: 401 });
	}

	const formData = await request.formData();
	const lessonId = Number(formData.get('lessonId'));
	const rating = Number(formData.get('rating'));
	const content = formData.get('content') as string;

	// ?��?지 처리: image1 ~ image5 추출
	const images: string[] = [];
	for (let i = 1; i <= 5; i++) {
		const imgFile = formData.get(`image${i}`);
		if (imgFile instanceof File) {
			// Mock??가�?URL ?�성
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

	// 주문 ?�이???�동: ?�당 lessonId�?가�?주문??reviewId ?�데?�트
	const order = MOCK_ORDERS.find((o) => o.lessonId === lessonId);
	if (order) {
		order.reviewId = id;
	}

	return HttpResponse.json(newReview, { status: 201 });
});

// ?��? ?�성???�정 ?�래??리뷰 조회
const getMyReview = http.get(`${httpUrl}/reviews/me/:lessonId`, async ({ params }) => {
	await delay(500);
	const lessonId = Number(params.lessonId);

	// ??리뷰 목록?�서 먼�? 찾고, ?�으�??�체 mockReviews?�서 ??ID(1)??것을 찾음
	const review =
		mockMyReviews.find((r) => r.lessonId === lessonId) ||
		mockReviews.find((r) => r.lessonId === lessonId && r.user.id === 1);

	if (review) {
		return HttpResponse.json(review, { status: 200 });
	}

	return HttpResponse.json(null, { status: 200 });
});

// 리뷰 ?�정
const updateReview = http.put(`${httpUrl}/reviews/:reviewId`, async ({ params, request }) => {
	await delay(500);
	const { reviewId } = params;
	const formData = await request.formData();
	const rating = formData.get('rating') ? Number(formData.get('rating')) : undefined;
	const content = formData.get('content') as string;

	// ?��?지 처리: image1 ~ image5 추출
	const images: string[] = [];
	for (let i = 1; i <= 5; i++) {
		const imgFile = formData.get(`image${i}`);
		if (imgFile instanceof File) {
			images.push(`https://placehold.co/400x300?text=Updated+Image+${i}`);
		}
	}

	// ??리뷰 목록?�서 검??
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

	return HttpResponse.json({ message: '리뷰�?찾을 ???�습?�다.' }, { status: 404 });
});

export const reviewHandler = [writeReview, getMyReview, updateReview];
