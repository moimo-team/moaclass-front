import { delay, http, HttpResponse } from 'msw';

import type { CouponInfo, CouponStatus } from '@/models/coupon.model';

import { coupons, userCouponsData } from './mockData/couponMock';
import { httpUrl } from './mockData/mockData';

// 유저 쿠폰 내역 조회
const getUserCoupons = http.get(`${httpUrl}/coupons/me`, async ({ request }) => {
	await delay(500);

	const token = request.headers.get('Authorization');
	if (!token) {
		return HttpResponse.json({ message: '토큰이 없습니다.' }, { status: 401 });
	}

	const uid = 1;
	const now = new Date();

	// 1) 해당 유저의 보유 쿠폰 필터링
	const myCoupons = userCouponsData.filter((uc) => uc.userId === uid);

	// 2) 쿠폰 상세 정보 조인 및 상태 계산
	const joinedCoupons: CouponInfo[] = myCoupons
		.map((mc) => {
			const couponDetail = coupons.find((c) => c.id === mc.couponId);
			if (!couponDetail) return undefined;

			// 쿠폰 상태 결정: 사용 여부 -> 만료 여부 순으로 확인
			let status: CouponStatus = 'AVAILABLE';

			if (mc.isUsed) {
				status = 'USED';
			} else if (new Date(couponDetail.validUntil) < now) {
				status = 'EXPIRED';
			}

			return {
				...couponDetail,
				status,
			} as CouponInfo;
		})
		.filter((c): c is CouponInfo => c !== undefined);

	return HttpResponse.json(joinedCoupons, { status: 200 });
});

// 유저의 사용가능 쿠폰 조회(모달창)
const getAvailableCoupons = http.get(`${httpUrl}/coupons/available`, async ({ request }) => {
	await delay(500);

	// 토큰 인증 확인
	const token = request.headers.get('Authorization');
	if (!token) {
		return HttpResponse.json({ message: '토큰이 없습니다.' }, { status: 401 });
	}

	const uid = 1; // 실제로는 토큰에서 userId 추출
	const now = new Date();

	// 1) 사용 안 한 쿠폰만 필터링
	const myCoupons = userCouponsData.filter((uc) => uc.userId === uid && !uc.isUsed);

	// 2) 쿠폰 상세 정보 조인 + 만료되지 않은 것만 반환
	const joinedCoupons: CouponInfo[] = myCoupons
		.map((mc) => {
			const couponDetail = coupons.find((c) => c.id === mc.couponId);
			if (!couponDetail) return undefined;

			// 만료된 쿠폰은 제외
			if (new Date(couponDetail.validUntil) < now) {
				return undefined;
			}

			return {
				...couponDetail,
				status: 'AVAILABLE',
			} as CouponInfo;
		})
		.filter((c): c is CouponInfo => c !== undefined);

	return HttpResponse.json(joinedCoupons, { status: 200 });
});

export const couponHandlers = [getUserCoupons, getAvailableCoupons];
