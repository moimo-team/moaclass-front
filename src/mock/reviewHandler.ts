import { http, HttpResponse, delay } from 'msw';

import type { MyReviewItem } from '@/models/review.model';

import { httpUrl, mockLessons, mockReviews } from './mockData/mockData';
import { MOCK_ORDERS } from './mockData/orderMock';
import { mockMyReview } from './reviewMock';

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

	// 이미지 처리: image1 ~ image8 개별 필드 추출 (File이면 Mock URL, 아니면 null)
	const getImageUrl = (key: string): string | null => {
		const file = formData.get(key);
		return file instanceof File ? URL.createObjectURL(file) : null;
	};

	const id = Math.floor(Math.random() * 10000);
	const newReview: MyReviewItem = {
		hasReview: true,
		review: {
			id,
			lessonId,
			rating,
			content,
			image1: getImageUrl('image1'),
			image2: getImageUrl('image2'),
			image3: getImageUrl('image3'),
			image4: getImageUrl('image4'),
			image5: getImageUrl('image5'),
			image6: getImageUrl('image6'),
			image7: getImageUrl('image7'),
			image8: getImageUrl('image8'),
		},
	};

	// 주문 데이터 연동: 해당 lessonId를 가진 주문의 reviewId 업데이트
	const order = MOCK_ORDERS.find((o) => o.lessonId === lessonId);
	if (order) {
		order.reviewId = id;
	}

	return HttpResponse.json(newReview, { status: 201 });
});

// 내가 작성한 특정 클래스 리뷰 조회
const getMyReview = http.get(`${httpUrl}/reviews/me/:enrollmentId`, async ({ params }) => {
	await delay(500);
	const enrollmentId = Number(params.enrollmentId);

	if (enrollmentId === 3) {
		return HttpResponse.json(mockMyReview, { status: 200 });
	}

	return HttpResponse.json(
		{
			hasReview: false,
			review: null,
		},
		{ status: 200 },
	);
});

// 리뷰 수정
const updateReview = http.put(`${httpUrl}/reviews/:reviewId`, async ({ params, request }) => {
	await delay(500);
	const { reviewId } = params;
	const formData = await request.formData();
	const rating = formData.get('rating') ? Number(formData.get('rating')) : undefined;
	const content = formData.get('content') as string;

	// 이미지 처리:
	// - File이면 Mock URL 반환 (신규 업로드)
	// - string이면 기존 URL 그대로 반환 (수정 모드에서 보존된 기존 이미지)
	// - null이면 기존 값 유지
	const getImageUrl = (key: string, existingValue: string | null | undefined): string | null => {
		const value = formData.get(key);
		if (value instanceof File) {
			return URL.createObjectURL(value);
		}
		if (typeof value === 'string') {
			return value;
		}
		return existingValue ?? null;
	};

	// mockMyReview가 해당 reviewId인 경우 업데이트
	if (mockMyReview.review?.id === Number(reviewId)) {
		if (rating !== undefined) mockMyReview.review.rating = rating;
		if (content !== undefined) mockMyReview.review.content = content;
		mockMyReview.review.image1 = getImageUrl('image1', mockMyReview.review.image1);
		mockMyReview.review.image2 = getImageUrl('image2', mockMyReview.review.image2);
		mockMyReview.review.image3 = getImageUrl('image3', mockMyReview.review.image3);
		mockMyReview.review.image4 = getImageUrl('image4', mockMyReview.review.image4);
		mockMyReview.review.image5 = getImageUrl('image5', mockMyReview.review.image5);
		mockMyReview.review.image6 = getImageUrl('image6', mockMyReview.review.image6);
		mockMyReview.review.image7 = getImageUrl('image7', mockMyReview.review.image7);
		mockMyReview.review.image8 = getImageUrl('image8', mockMyReview.review.image8);
		return HttpResponse.json(mockMyReview, { status: 200 });
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
