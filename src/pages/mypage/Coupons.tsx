import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PointCouponInfo } from "@/components/features/mypage/PointCouponInfo";
import { COUPON_TABS } from "@/constants/tabs";
import { CouponCard } from "@/components/features/coupon/CouponCard";
import { useUserCouponsQuery } from "@/hooks/useCouponQuery";
import type { CouponStatus } from "@/models/coupon.model";
import LoadingSpinner from "@/components/common/LoadingSpinner";

// 탭 상태 타입
type TabStatus = (typeof COUPON_TABS)[number];

/**
 * API 쿠폰 상태를 탭 상태로 변환
 * @param status API에서 받은 쿠폰 상태 ("USED" | "AVAILABLE" | "EXPIRED")
 * @returns 탭에서 사용하는 상태 ("사용완료" | "사용가능" | "기간만료")
 */
const mapCouponStatusToTab = (
  status: CouponStatus,
): Exclude<TabStatus, "전체"> => {
  const statusMap: Record<CouponStatus, Exclude<TabStatus, "전체">> = {
    USED: "사용완료",
    AVAILABLE: "사용가능",
    EXPIRED: "기간만료",
  };
  return statusMap[status];
};

const Coupons = () => {
  const [activeTab, setActiveTab] = useState<TabStatus>("사용가능");
  const { data: userCoupons, isLoading } = useUserCouponsQuery();

  // 쿠폰 목록을 탭 상태에 맞게 필터링
  const filteredCoupons = useMemo(() => {
    if (!userCoupons) return [];

    // 전체 탭인 경우 모든 쿠폰 반환
    if (activeTab === "전체") return userCoupons;

    // 각 쿠폰의 상태를 탭 상태로 변환하여 필터링
    return userCoupons.filter((coupon) => {
      if (!coupon.status) return false;
      const tabStatus = mapCouponStatusToTab(coupon.status);
      return tabStatus === activeTab;
    });
  }, [userCoupons, activeTab]);

  // 사용 가능한 쿠폰 개수 계산
  const availableCount = useMemo(() => {
    if (!userCoupons) return 0;
    return userCoupons.filter((c) => c.status === "AVAILABLE").length;
  }, [userCoupons]);

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredCoupons.map((coupon, index) => (
              <motion.div
                key={coupon.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className="h-full"
              >
                <CouponCard coupon={coupon} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {!isLoading && filteredCoupons.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <p className="text-lg font-medium">해당되는 쿠폰이 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default Coupons;
