import LoadingSpinner from '@/components/common/LoadingSpinner';
import { FormModal } from '@/components/features/modal/components/FormModal';
import { Badge } from '@/components/ui/badge';
import { useOrderDetailQuery } from '@/hooks/useOrderlistQuery';
import { cn } from '@/lib/utils';
import type { Order } from '@/models/order.model';
import { formatDateTime } from '@/utils/dateFormat';

import { OrderClassInfo } from './OrderClassInfo';

interface OrderDetailModalProps {
	isOpen: boolean;
	onClose: () => void;
	order: Order | null;
}

const OrderDetailModal = ({ isOpen, onClose, order }: OrderDetailModalProps) => {
	const { data: detail, isLoading, isError } = useOrderDetailQuery(order?.enrollmentId ?? 0);

	if (!order) return null;

	const isCanceled = order.status === '수강취소';

	return (
		<FormModal
			isOpen={isOpen}
			onClose={onClose}
			title="결제 내역 상세"
			containerClassName="max-w-md"
			showFooter={false}
			isLoading={isLoading}
			loadingComponent={
				<div className="flex justify-center py-20">
					<LoadingSpinner />
				</div>
			}
		>
			<div className="space-y-4">
				{isError ? (
					<div className="text-center py-10 bg-red-50 text-red-700 rounded-lg border border-dashed border-red-200">
						<p>상세 데이터를 불러올 수 없습니다.</p>
					</div>
				) : detail ? (
					<>
						{/* 주문 번호 표시 (FormModal 상단) */}
						<div className="mb-2">
							<p className="text-muted-foreground text-sm font-medium">
								주문번호 : {detail.orderId}
							</p>
						</div>

						{/* 클래스 정보 섹션 */}
						<OrderClassInfo
							title={detail.classInfo.title}
							teacherName={detail.classInfo.teacherName}
							price={detail.paymentInfo.originPrice}
						/>

						{/* 수강취소사유 (조건부) */}
						{isCanceled && detail.refundInfo?.reason && (
							<div className="border border-[#4A5D4A] rounded-[16px] p-5 space-y-2 bg-[#FDFEFC]">
								<div className="flex items-center gap-2">
									<span className="font-bold text-sm text-[#4A5D4A]">
										수강취소사유
									</span>
									<Badge
										variant="outline"
										className="text-[10px] h-5 border-[#4A5D4A] text-[#4A5D4A]"
									>
										{detail.refundInfo.reason}
									</Badge>
								</div>
								{detail.refundInfo?.detailReason && (
									<p className="text-[#667085] text-sm leading-relaxed bg-white/50 p-3 rounded-lg border border-dashed border-[#4A5D4A]/20">
										{detail.refundInfo.detailReason}
									</p>
								)}
							</div>
						)}

						<div className="space-y-4">
							{/* 결제 금액 요약 섹션 */}
							<div className="bg-[#F8F9F8] rounded-[20px] p-6 space-y-4">
								<div className="flex justify-between items-center">
									<span className="font-bold text-[#2D3A3A]">총 결제 금액</span>
									<span className="font-bold text-xl text-[#2D3A3A]">
										{detail.paymentInfo.finalPrice.toLocaleString()}원
									</span>
								</div>

								<div className="space-y-2 text-sm text-muted-foreground pt-2 border-t border-gray-100">
									<div className="flex justify-between">
										<span>상품 금액</span>
										<span>
											{detail.paymentInfo.originPrice.toLocaleString()}원
										</span>
									</div>
									<div className="flex justify-between items-center">
										<span>할인 금액</span>
										<span className="text-gray-400">
											-{detail.paymentInfo.discountAmount.toLocaleString()}원
										</span>
									</div>
								</div>
							</div>

							{/* 환불 금액 요약 섹션 (조건부) */}
							{isCanceled && detail.refundInfo !== null && (
								<div className="bg-[#F8F9F8] rounded-[20px] p-6 space-y-4">
									<div className="flex justify-between items-center">
										<span className="font-bold text-[#2D3A3A]">
											총 환불 금액
										</span>
										<span className="font-bold text-xl text-[#2D3A3A]">
											{detail.refundInfo.refundAmount.toLocaleString()}원
										</span>
									</div>

									<div className="space-y-2 text-sm text-muted-foreground pt-2 border-t border-gray-100">
										<div className="flex justify-between">
											<span>실 결제 금액</span>
											<span>
												{detail.refundInfo.paidAmount.toLocaleString()}원
											</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="font-bold text-[#2D3A3A]">
												차감 금액
											</span>
											<span className="text-gray-400">
												-{detail.refundInfo.deductedAmount.toLocaleString()}
												원
											</span>
										</div>
									</div>
								</div>
							)}

							{/* 하단 상세 정보 */}
							<div className="bg-[#F8F9F8] rounded-[20px] p-6 space-y-4">
								<div className="flex justify-between items-center">
									<span className="text-sm font-medium text-gray-500">상태</span>
									<Badge
										variant={isCanceled ? 'carrot' : 'default'}
										className={cn(
											'font-medium px-2 py-0.5 rounded-[4px] text-[11px]',
										)}
									>
										{isCanceled ? '결제 취소' : '결제 완료'}
									</Badge>
								</div>
								<div className="flex justify-between items-center text-sm">
									<span className="text-gray-500 font-medium">
										{isCanceled ? '환불 시각' : '결제 시각'}
									</span>
									<span className="text-[#2D3A3A] font-bold">
										{formatDateTime(
											isCanceled && detail.refundInfo?.refundDate
												? detail.refundInfo.refundDate
												: detail.paymentDate,
										)}
									</span>
								</div>
							</div>
						</div>
					</>
				) : null}
			</div>
		</FormModal>
	);
};

export default OrderDetailModal;
