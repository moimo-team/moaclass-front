import { http, HttpResponse, delay } from 'msw';

import { httpUrl } from './mockData/mockData';
import { payPreviewMock } from './mockData/payPreviewMock';
import { userStore } from './mockData/userMock';

// 결제 프리뷰 페이지 조회
const getPayPreview = http.get(`${httpUrl}/payments/preview`, async ({ request }) => {
	await delay(500);
	const token = request.headers.get('Authorization');
	if (!token) {
		return HttpResponse.json({ message: '토큰이 없습니다.' }, { status: 401 });
	}

	try {
		const url = new URL(request.url);
		const _scheduleId = Number(url.searchParams.get('scheduleId'));
		const _quantity = Number(url.searchParams.get('quantity')) || 1; // 기본값 1

		return HttpResponse.json(payPreviewMock, { status: 200 });
	} catch (_error) {
		return HttpResponse.json({ message: '잘못된 요청입니다.' }, { status: 400 });
	}
});

// 쿠폰 선택 계산
const calculateCouponDiscount = http.post(
	`${httpUrl}/payments/calculate`,
	async ({ request: _request }) => {
		await delay(500);
		const token = _request.headers.get('Authorization');
		if (!token) {
			return HttpResponse.json({ message: '토큰이 없습니다.' }, { status: 401 });
		}

		try {
			// const { scheduleId, quantity, couponId } = (await request.json()) as any;

			// TODO: 실제 쿠폰 계산 로직 구현
			// 현재는 성공 응답만 반환
			return HttpResponse.json(
				{
					message: '쿠폰이 적용되었습니다.',
					subtotal: 40000,
					couponDiscount: 4000,
					finalPrice: 36000,
					userPoints: 42000,
					canPay: true,
				},
				{ status: 200 },
			);
		} catch (error) {
			return HttpResponse.json(
				{ message: '쿠폰 계산 중 오류가 발생했습니다.' },
				{ status: 500 },
			);
		}
	},
);

// 결제 (수강생 등록)
const createEnrollment = http.post(`${httpUrl}/enrollments`, async ({ request }) => {
	await delay(500);
	const token = request.headers.get('Authorization');
	if (!token) {
		return HttpResponse.json({ message: '토큰이 없습니다.' }, { status: 401 });
	}

	try {
		const {
			quantity: _quantity,
			scheduleId: _scheduleId,
			finalPrice,
			couponId: _couponId,
			email,
		} = (await request.json()) as any;

		const currentPoints = userStore.userInfo.point || 0;

		// 포인트 부족 체크
		if (currentPoints < finalPrice) {
			return HttpResponse.json(
				{
					canPay: false,
					error: {
						code: 'INSUFFICIENT_POINTS',
						message: '보유 포인트가 부족하여 결제를 진행할 수 없습니다.',
					},
					requiredPoints: finalPrice,
					userPoints: currentPoints,
				},
				{ status: 400 },
			);
		}

		// 결제 처리 (포인트 차감)
		userStore.updatePoint(-finalPrice);
		const remainingPoints = userStore.userInfo.point || 0;

		return HttpResponse.json(
			{
				enrollmentId: Math.floor(Math.random() * 1000000) + 1,
				status: 'ACCEPTED',
				transaction: {
					id: Math.floor(Math.random() * 1000) + 1,
					amount: finalPrice,
					type: 'USE',
					status: 'COMPLETED',
				},
				remainingPoints: remainingPoints,
				email: email,
			},
			{ status: 201 },
		);
	} catch (_error) {
		return HttpResponse.json({ message: '결제 생성 중 오류가 발생했습니다.' }, { status: 500 });
	}
});

export const payHandler = [getPayPreview, createEnrollment, calculateCouponDiscount];
