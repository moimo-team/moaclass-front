import { delay, http, HttpResponse } from "msw";
import { httpUrl } from "./mockData/mockData";
import type { CouponInfo } from "@/models/coupon.model";
import { coupons, userCouponsData } from "./mockData/couponMock";

// 유저의 사용가능 쿠폰 조회
const getUserCoupons = http.get(`${httpUrl}/coupons/:userId`, async ({ params }) => {
    await delay(500);
    const { userId } = params;
    const uid = Number(userId);

    // 1) 해당 유저의 보유 쿠폰 필터링
    const myCoupons = userCouponsData.filter(uc => uc.userId === uid && !uc.isUsed);

    // 2) 쿠폰 상세 정보 조인
    const joinedCoupons: CouponInfo[] = myCoupons.map(mc => {
        const couponDetail = coupons.find(c => c.id === mc.couponId);
        if (!couponDetail) return undefined;

        return {
            ...couponDetail,
            // CouponInfo 확장에 필요한 필드들 (필요시 추가)
            status: "AVAILABLE"
        } as CouponInfo;
    }).filter((c): c is CouponInfo => c !== undefined);

    return HttpResponse.json(joinedCoupons, { status: 200 });
});

export const couponHandlers = [
    getUserCoupons
];