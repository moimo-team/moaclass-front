import type { CouponInfo } from "./coupon.model";


export interface PayPreview {
    lesson: {
        lessonId: number;
        title: string;
        representativeImage: string;
        startAt: string;
        discountedPrice: number;
        address: string;
    },
    user: {
        email: string;
        nickname: string;
    },
    availableCouponCnt: number,
    availablePoints: number;
}

export interface PayPreviewResponse extends PayPreview {
    price: {
        quantity: number;
        subtotal: number;
        total: number;
    }
}