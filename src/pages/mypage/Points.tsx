import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PointChargeModal } from '@/components/features/pay/PointChargeModal';
import { toast } from 'sonner';

// 유저 정보
interface UserInfo {
    id: string;
    name: string;
    email: string;
    point: number;
}

const MOCK_USER_POINTS: UserInfo = {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    point: 1500,
};

// 포인트 내역 타입 정의
interface PointHistory {
    id: string;
    type: '적립' | '사용';
    title: string;
    amount: number;
    date: string;
    time: string;
}

const MOCK_POINT_HISTORY: PointHistory[] = [
    {
        id: '1',
        type: '적립',
        title: '21시[월수] 초.중급반 저녁A /성인요금 ...',
        amount: 31,
        date: '11.14',
        time: '00:23'
    },
    {
        id: '2',
        type: '적립',
        title: '감자통모짜 핫도그 외 2개',
        amount: 284,
        date: '11.13',
        time: '11:36'
    },
    {
        id: '3',
        type: '적립',
        title: '네이버페이 즉시적립',
        amount: 15,
        date: '11.10',
        time: '00:44'
    },
    {
        id: '4',
        type: '사용',
        title: '홍루이젠보라매자이점',
        amount: -2700,
        date: '10.29',
        time: '22:29'
    },
    {
        id: '5',
        type: '사용',
        title: '21시[월수] 초.중급반 저녁A /성인요금 ...',
        amount: -20000,
        date: '10.15',
        time: '00:03'
    },
];

const Points = () => {
    const [activeTab, setActiveTab] = useState<'전체' | '적립' | '사용'>('전체');
    const [isChargeModalOpen, setIsChargeModalOpen] = useState(false);
    const [userPoints, setUserPoints] = useState(MOCK_USER_POINTS.point);

    const handleCharge = (amount: number) => {
        setUserPoints(prev => prev + amount);
        toast.success(`${amount.toLocaleString()}포인트가 충전되었습니다.`);
    };

    const filteredHistory = MOCK_POINT_HISTORY.filter((item) => {
        if (activeTab === '전체') return true;
        return item.type === activeTab;
    });

    return (
        <div className="max-w-3xl mx-auto w-full p-6 space-y-6 bg-white min-h-screen">
            {/* 헤더 영역 */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-foreground">포인트</h1>
                <Button
                    variant="outline"
                    onClick={() => setIsChargeModalOpen(true)}
                    className="bg-[#c3d9c6] text-white border-none hover:bg-[#b0ccb4] rounded-xl px-4 py-2 text-sm font-bold"
                >
                    포인트 충전
                </Button>
            </div>

            {/* 메인 포인트 카드 */}
            <Card className="bg-[#dfece3] border-none shadow-none rounded-3xl overflow-hidden relative pb-14">
                <CardContent className="pt-8 px-8 flex flex-col items-start gap-8">
                    <h2 className="text-xl font-extrabold text-[#2f2f2f] tracking-tight">
                        사용 가능 포인트
                    </h2>
                    <div className="w-full flex justify-end items-baseline gap-2 mt-4 bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
                        <span className="text-4xl font-black text-[#2f2f2f]">{userPoints.toLocaleString()}</span>
                        <span className="text-2xl font-bold text-[#2f2f2f]">원</span>
                    </div>
                </CardContent>

                {/* 탭 시스템 */}
                <div className="absolute bottom-0 left-0 w-full flex border-t border-black/10 bg-[#dfece3]/50 backdrop-blur-sm">
                    {(['전체', '적립', '사용'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-4 text-lg font-bold transition-all relative ${activeTab === tab ? 'text-black' : 'text-black/40'
                                }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <motion.div
                                    layoutId="activeTabUnderline"
                                    className="absolute bottom-0 left-0 w-full h-1 bg-[#6b8f71]"
                                />
                            )}
                            {tab !== '사용' && (
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-6 bg-black/10" />
                            )}
                        </button>
                    ))}
                </div>
            </Card>

            {/* 내역 리스트 */}
            <div className="space-y-1 mt-4 min-h-[400px]">
                <AnimatePresence mode="popLayout">
                    {filteredHistory.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center justify-between py-5 border-b border-gray-50 last:border-none group hover:bg-gray-50/50 px-2 rounded-xl transition-colors"
                        >
                            <div className="flex gap-4">
                                <div className="text-sm font-medium text-black/30 mt-1 tabular-nums w-10">
                                    {item.date}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1 cursor-pointer">
                                        <h3 className="text-[15px] font-bold text-[#2f2f2f] line-clamp-1 group-hover:text-primary transition-colors">
                                            {item.title}
                                        </h3>
                                        <ChevronRight className="w-4 h-4 text-black/20" />
                                    </div>
                                    <div className="flex items-center text-[12px] text-black/30 font-medium">
                                        <span>{item.time}</span>
                                        <div className="mx-1.5 w-px h-2 bg-black/10" />
                                        {item.type === '적립' && (
                                            <div className="ml-1 w-3 h-3 rounded-full bg-black/5 flex items-center justify-center">
                                                <ChevronRight className="w-2 h-2 rotate-90" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`text-[15px] font-black tabular-nums ${item.type === '적립' ? 'text-[#4f8f6a]' : 'text-[#2f2f2f]'
                                    }`}>
                                    {item.type === '적립' ? `+${item.amount.toLocaleString()}` : item.amount.toLocaleString()}원
                                </span>
                                <button className="p-1 hover:bg-black/5 rounded-full transition-colors opacity-0 group-hover:opacity-100">
                                    <X className="w-3.5 h-3.5 text-black/20" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
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
