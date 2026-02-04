import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PointCouponInfo } from '@/components/features/mypage/PointCouponInfo';
import { COUPON_TABS } from '@/constants/tabs';
import { CouponCard } from '@/components/features/coupon/CouponCard';

// 쿠폰 상태 타입
type TabStatus = typeof COUPON_TABS[number];
type CouponStatus = Exclude<TabStatus, '전체'>;

// 쿠폰 데이터 인터페이스
interface Coupon {
    id: string;
    name: string;
    discountLabel: string;
    expiryDate: string;
    status: CouponStatus;
    type: 'percentage' | 'amount';
    amount: number;
}

const MOCK_COUPONS: Coupon[] = [
    {
        id: '1',
        name: '가입 환영 20% 할인쿠폰',
        discountLabel: '총 금액에서 20%',
        expiryDate: '2026.02.28 23:59',
        status: '사용가능',
        type: 'percentage',
        amount: 20
    },
    {
        id: '2',
        name: '가입 환영 5000원 할인쿠폰',
        discountLabel: '5,000원',
        expiryDate: '2026.02.28 23:59',
        status: '사용가능',
        type: 'amount',
        amount: 5000
    },
    {
        id: '3',
        name: '첫 구매 감사 10% 할인쿠폰',
        discountLabel: '총 금액에서 10%',
        expiryDate: '2025.12.31 23:59',
        status: '기간만료',
        type: 'percentage',
        amount: 10
    },
    {
        id: '4',
        name: '시즌 이벤트 3000원 쿠폰',
        discountLabel: '3,000원',
        expiryDate: '2026.01.15 23:59',
        status: '사용완료',
        type: 'amount',
        amount: 3000
    }
];

const Coupons = () => {
    const [activeTab, setActiveTab] = useState<TabStatus>('사용가능');

    const filteredCoupons = MOCK_COUPONS.filter((coupon) => {
        if (activeTab === '전체') return true;
        return coupon.status === activeTab;
    });

    const availableCount = MOCK_COUPONS.filter(c => c.status === '사용가능').length;

    return (
        <div className="max-w-3xl mx-auto w-full p-6 space-y-6 bg-white min-h-screen">
            {/* 헤더 영역 */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-foreground">쿠폰 내역</h1>
            </div>

            {/* 메인 쿠폰 요약 카드 (공통 컴포넌트) */}
            <PointCouponInfo
                title="사용 가능 쿠폰"
                value={availableCount}
                unit="개"
                tabs={COUPON_TABS}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {/* 쿠폰 리스트 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <AnimatePresence mode="popLayout">
                    {filteredCoupons.map((coupon, index) => (
                        <motion.div
                            key={coupon.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <CouponCard coupon={coupon} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredCoupons.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <p className="text-lg font-medium">해당되는 쿠폰이 없습니다.</p>
                </div>
            )}
        </div>
    );
};

export default Coupons;