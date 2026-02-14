import { delay, http, HttpResponse } from 'msw';

import type { PayStatus } from '@/models/pay.model';
import type { PointType } from '@/models/point.model';

import { httpUrl } from './mockData/mockData';
import { MOCK_POINT_HISTORY } from './mockData/pointMock';
import { userStore } from './mockData/userMock';

// 포인트 내역 상태 관리 (메모리)
const pointHistory = [...MOCK_POINT_HISTORY];

// 유저 포인트 내역 조회
const getUserPoints = http.get(`${httpUrl}/points/me`, async ({ request }) => {
	await delay(1000);
	const token = request.headers.get('Authorization');
	if (!token) {
		console.error('getUserPoints mock error: 토큰이 없습니다.');
		return HttpResponse.json({ message: '토큰이 없습니다.' }, { status: 401 });
	}

	// 최신 순으로 정렬하여 반환 (createdAt 기준 내림차순)
	const sortedHistory = [...pointHistory].sort(
		(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
	);

	return HttpResponse.json(
		{
			userPoints: userStore.userInfo.point,
			history: sortedHistory,
		},
		{ status: 200 },
	);
});

// 포인트 충전
const chargePoint = http.post(`${httpUrl}/points/charge`, async ({ request }) => {
	await delay(1000);
	const token = request.headers.get('Authorization');
	if (!token) {
		console.error('chargePoint mock error: 토큰이 없습니다.');
		return HttpResponse.json({ message: '토큰이 없습니다.' }, { status: 401 });
	}

    try {
      const { amount } = (await request.json()) as { amount: number };

		// Mock Data 업데이트 (유저 포인트)
		userStore.updatePoint(amount);

		// Mock Data 업데이트 (포인트 내역 추가)
		const newPointHistory = {
			transactionId: Math.floor(Math.random() * 1000000),
			type: 'CHARGE' as PointType,
			title: '포인트 충전',
			amount: amount,
			coupon: null,
			status: 'COMPLETED' as PayStatus,
			createdAt: new Date().toISOString(), // 현재 시간
		};
		pointHistory.push(newPointHistory);

      return HttpResponse.json(
        {
          transaction: {
            id: 44,
            amount: amount,
            type: "CHARGE",
            status: "COMPLETED",
            createdAt: "2026-02-11T21:54:31.586Z",
          },
          userPoints: userStore.userInfo.point,
        },
        { status: 201 },
      );
    } catch (error) {
      return HttpResponse.json(
        { message: "포인트 충전 중 오류가 발생했습니다." },
        { status: 500 },
      );
    }
  },
);

export const pointHandlers = [getUserPoints, chargePoint];
