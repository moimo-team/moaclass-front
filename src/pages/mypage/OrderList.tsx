import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import PaginationComponent from "@/components/common/PaginationComponent";

// Mock Data
const MOCK_ORDERS = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    className: `클래스명${i + 1}`,
    date: "2026.01.29(목)",
    startTime: "오후 12:00",
    endTime: "오후 15:00",
    status: i % 3 === 0 ? "예약완료" : i % 3 === 1 ? "예약취소" : "참석완료",
    imageUrl: `https://picsum.photos/seed/${i + 100}/200/120`,
}));

type OrderStatus = "전체" | "예약완료" | "예약취소" | "참석완료";

const OrderList = () => {
    const [filterStatus, setFilterStatus] = useState<OrderStatus>("전체");
    const [currentPage, setCurrentPage] = useState(1);
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

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case "예약완료":
                return "default"; // primary color
            case "참석완료":
                return "secondary";
            case "예약취소":
                return "destructive";
            default:
                return "outline";
        }
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
                        <Card key={order.id} className="overflow-hidden border-primary/10 hover:border-primary/30 transition-colors">
                            <CardContent className="p-0">
                                <div className="flex flex-col sm:flex-row items-stretch">
                                    {/* Left: Image */}
                                    <div className="w-full sm:w-48 h-32 sm:h-auto overflow-hidden bg-muted">
                                        <img
                                            src={order.imageUrl}
                                            alt={order.className}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Middle: Info */}
                                    <div className="flex-1 p-5 flex flex-col justify-center">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge variant={getStatusBadgeVariant(order.status) as any}>
                                                {order.status}
                                            </Badge>
                                            <h3 className="text-lg font-semibold truncate hover:text-primary cursor-pointer transition-colors">
                                                {order.className}
                                            </h3>
                                        </div>
                                        <p className="text-muted-foreground text-sm">
                                            {order.date} {order.startTime} ~ {order.endTime}
                                        </p>
                                    </div>

                                    {/* Right: Actions */}
                                    <div className="p-5 border-t sm:border-t-0 sm:border-l border-primary/10 bg-sidebar/30 flex flex-col justify-center gap-2 min-w-[180px]">
                                        <div className="grid grid-cols-2 gap-2">
                                            <Button variant="outline" size="sm" className="w-full h-9 border-primary/20 text-xs sm:text-sm text-muted-foreground hover:text-primary">
                                                결제 상세
                                            </Button>
                                            <Button
                                                variant="default"
                                                size="sm"
                                                className="w-full h-9 text-xs sm:text-sm"
                                                disabled={order.status !== "참석완료"}
                                            >
                                                후기 작성
                                            </Button>
                                            <Button variant="outline" size="sm" className="w-full h-9 border-primary/20 text-xs sm:text-sm text-muted-foreground hover:text-primary">
                                                채팅 문의
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="w-full h-9 opacity-80 hover:opacity-100 text-xs sm:text-sm"
                                                disabled={order.status !== "예약완료"}
                                            >
                                                수강 취소
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
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
        </div>
    );
};

export default OrderList;