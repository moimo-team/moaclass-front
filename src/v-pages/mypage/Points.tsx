import { useMemo, useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

import LoadingSpinner from '@/components/common/LoadingSpinner';
import { PointChargeModal } from '@/components/features/modal/point/PointChargeModal';
import { PointCouponInfo } from '@/components/features/mypage/PointCouponInfo';
import { Button } from '@/components/ui/button';
import { POINT_TABS } from '@/constants/tabs';
import { useAuthQuery } from '@/hooks/useAuthQuery';
import { useChargePointMutation } from '@/hooks/usePointMutations';
import { usePointQuery } from '@/hooks/usePointQuery';
import { formatDateTime } from '@/utils/dateFormat';
import { createPointMapper } from '@/utils/point/createPointMapper';

// 탭 상태 타입
type TabStatus = (typeof POINT_TABS)[number];

/**
 * API 포인트 타입을 탭 상태로 변환
 * @param status API에서 받은 포인트 타입 ("CHARGE" | "USE" | "REFUND")
 * @returns 탭에서 사용하는 상태 ("전체" | "적립" | "사용")
 */
const mapPointToPointTab = createPointMapper<typeof POINT_TABS>({
	CHARGE: '충전 및 환불',
	REFUND: '충전 및 환불',
	EVENT: '충전 및 환불',
	USE: '사용',
});

const Points = () => {
	const [activeTab, setActiveTab] = useState<TabStatus>('전체');
	const [isChargeModalOpen, setIsChargeModalOpen] = useState(false);
	const { data: pointData, isLoading } = usePointQuery();
	const { data: userInfo } = useAuthQuery();
	const { mutateAsync: chargePoint } = useChargePointMutation();

	// 사용 가능 포인트
	const totalPoints = userInfo?.point || 0;

	// 포인트 충전
	const handleCharge = async (amount: number) => {
		await chargePoint(amount);
	};

	// 포인트 목록을 탭 상태에 맞게 필터링
	const filteredHistory = useMemo(() => {
		if (!pointData) return [];
		return pointData.history.filter((point) => {
			if (activeTab === '전체') {
				return point.type === 'USE' || point.type === 'CHARGE' || point.type === 'REFUND';
			}
			return mapPointToPointTab(point.type) === activeTab;
		});
	}, [pointData, activeTab]);

	return (
		<div className="max-w-3xl mx-auto w-full p-6 space-y-6 bg-white min-h-screen">
			{/* 헤더 영역 */}
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold text-foreground">포인트 내역</h1>
				<Button
					variant="outline"
					onClick={() => setIsChargeModalOpen(true)}
					className="bg-[#c3d9c6] text-white border-none hover:bg-[#b0ccb4] rounded-xl px-4 py-2 text-sm font-bold"
				>
					포인트 충전
				</Button>
			</div>

			{/* 메인 포인트 카드 & 탭 시스템 */}
			<PointCouponInfo
				title="사용 가능 포인트"
				value={pointData?.userPoints || totalPoints}
				unit="원"
				tabs={POINT_TABS}
				activeTab={activeTab}
				onTabChange={setActiveTab}
			/>

			{/* 내역 리스트 */}
			<div className="space-y-1 mt-4 min-h-[400px]">
				{isLoading ? (
					<div className="flex justify-center items-center h-[200px]">
						<LoadingSpinner />
					</div>
				) : (
					<AnimatePresence mode="popLayout">
						{filteredHistory.length === 0 ? (
							<motion.div
								key="empty"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, x: -10 }}
								className="flex justify-center items-center h-[200px] text-gray-400"
							>
								<p>포인트 내역이 없습니다.</p>
							</motion.div>
						) : (
							filteredHistory.map((item, index) => (
								<motion.div
									key={item.transactionId}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, x: -10 }}
									transition={{ delay: index * 0.05 }}
									className="flex items-center justify-between py-5 border-b border-gray-50 last:border-none group hover:bg-gray-50/50 px-2 rounded-xl transition-colors"
								>
									<div className="flex gap-6">
										<div className="text-sm font-medium text-black/30 mt-1 tabular-nums w-16 shrink-0">
											{/* 날짜 파싱 (예: 26.01.02) */}
											{formatDateTime(item.createdAt, { type: 'date' })}
										</div>
										<div className="space-y-1">
											<div className="flex items-center gap-1">
												<h3 className="text-[15px] font-bold text-[#2f2f2f] line-clamp-1">
													{item.type === 'CHARGE'
														? '포인트 충전'
														: item.type === 'EVENT'
															? '이벤트'
															: item.lessonName}
												</h3>
											</div>
											<div className="flex items-center text-[12px] text-black/30 font-medium">
												{/* 시간 파싱 (예: 13:00) */}
												<span>
													{formatDateTime(item.createdAt, {
														type: 'time',
													})}
												</span>
												<div className="mx-1.5 w-px h-2 bg-black/10" />
												{mapPointToPointTab(item.type) ===
													'충전 및 환불' && (
													<div className="ml-1 w-3 h-3 rounded-full bg-black/5 flex items-center justify-center">
														<ChevronRight className="w-2 h-2 rotate-90" />
													</div>
												)}
											</div>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<span
											className={`text-[15px] font-black tabular-nums ${
												mapPointToPointTab(item.type) === '충전 및 환불'
													? 'text-[#4f8f6a]'
													: 'text-[#2f2f2f]'
											}`}
										>
											{mapPointToPointTab(item.type) === '충전 및 환불'
												? `+${item.amount.toLocaleString()}`
												: item.amount.toLocaleString()}
											원
										</span>
									</div>
								</motion.div>
							))
						)}
					</AnimatePresence>
				)}
			</div>

			<PointChargeModal
				open={isChargeModalOpen}
				onOpenChange={setIsChargeModalOpen}
				onCharge={handleCharge}
			/>
		</div>
	);
};

export default Points;
