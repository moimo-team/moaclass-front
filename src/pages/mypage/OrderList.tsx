import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import PaginationComponent from "@/components/common/PaginationComponent";
import OrderClassCard, { type Order } from "@/components/features/orderlist/OrderClassCard";
import OrderDetailModal from "@/components/features/orderlist/orderDetail/OrderDetailModal";

// Mock Data
const MOCK_ORDERS = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    className: `클래스명${i + 1}`,
    date: "2026.01.29(목)",
    startTime: "오후 12:00",
    endTime: "오후 15:00",
    status: i % 3 === 0 ? "예약완료" : i % 3 === 1 ? "예약취소" : "참석완료",
    imageUrl: `https://picsum.photos/seed/${i + 100}/200/120`,
    price: 33000,
}));

type OrderStatus = "전체" | "예약완료" | "예약취소" | "참석완료";

const OrderList = () => {
    const [filterStatus, setFilterStatus] = useState<OrderStatus>("전체");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const itemsPerPage = 5;

    // Filter Logic
    const filteredOrders = MOCK_ORDERS.filter((order) =>
        filterStatus === "전체" || order.status === filterStatus
    );

    // Pagination Logic
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const currentOrders = filteredOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleFilterChange = (value: string) => {
        setFilterStatus(value as OrderStatus);
        setCurrentPage(1);
    };

    const handleDetailClick = (order: Order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };


    return (
        <div className="max-w-6xl mx-auto w-full py-8 px-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-foreground">내가 신청한 클래스</h1>

                <div className="w-32">
                    <Select value={filterStatus} onValueChange={handleFilterChange}>
                        <SelectTrigger className="bg-white border-primary/20">
                            <SelectValue placeholder="전체" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="전체">전체</SelectItem>
                            <SelectItem value="예약완료">예약완료</SelectItem>
                            <SelectItem value="예약취소">예약취소</SelectItem>
                            <SelectItem value="참석완료">참석완료</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-4 mb-10">
                {currentOrders.length > 0 ? (
                    currentOrders.map((order) => (
                        <OrderClassCard
                            key={order.id}
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
                    <PaginationComponent
                        totalPages={totalPages}
                        page={currentPage}
                        setPage={setCurrentPage}
                    />
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
