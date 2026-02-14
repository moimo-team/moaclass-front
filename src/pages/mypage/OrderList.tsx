import { useState } from 'react';

import LoadingSpinner from '@/components/common/LoadingSpinner';
import PaginationComponent from '@/components/common/PaginationComponent';
import OrderClassCard from '@/components/features/orderlist/OrderClassCard';
import OrderDetailModal from '@/components/features/orderlist/orderDetail/OrderDetailModal';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useOrderlistQuery } from '@/hooks/useOrderlistQuery';
import type { Order } from '@/models/order.model';

const OrderList = () => {
	const [filter, setFilter] = useState('all');
	const [page, setPage] = useState(1);
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { orderlist, totalPages, isLoading, isError, error } = useOrderlistQuery(filter, page);

	const handleDetailClick = (order: Order) => {
		setSelectedOrder(order);
		setIsModalOpen(true);
	};

	return (
		<div className="max-w-6xl mx-auto w-full py-8 px-4">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-2xl font-bold text-foreground">내가 신청한 클래스</h1>

				<div className="w-32">
					<Select
						value={filter}
						onValueChange={(value) => {
							setFilter(value);
							setPage(1);
						}}
					>
						<SelectTrigger className="bg-white border-primary/20">
							<SelectValue placeholder="전체" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">전체</SelectItem>
							<SelectItem value="accepted">수강예정</SelectItem>
							<SelectItem value="cancel">수강취소</SelectItem>
							<SelectItem value="completed">수강완료</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="space-y-4 mb-10">
				{isLoading ? (
					<div className="flex justify-center py-20">
						<LoadingSpinner />
					</div>
				) : isError ? (
					<div className="text-center py-20 bg-red-50 text-red-700 rounded-lg border border-dashed border-red-200">
						<p>데이터를 불러오는 중 오류가 발생했습니다.</p>
						{error && <p className="text-sm text-red-600">{error.message}</p>}
					</div>
				) : orderlist.length > 0 ? (
					orderlist.map((order) => (
						<OrderClassCard
							key={order.enrollmentId}
							order={order}
							onDetailClick={handleDetailClick}
						/>
					))
				) : (
					<div className="text-center py-20 bg-muted/30 rounded-lg border border-dashed border-primary/20">
						<p className="text-muted-foreground">신청한 클래스 내역이 없습니다.</p>
					</div>
				)}
			</div>

			{totalPages > 1 && (
				<div className="mt-8">
					<PaginationComponent totalPages={totalPages} page={page} setPage={setPage} />
				</div>
			)}

			<OrderDetailModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				order={selectedOrder}
			/>
		</div>
	);
};

export default OrderList;
