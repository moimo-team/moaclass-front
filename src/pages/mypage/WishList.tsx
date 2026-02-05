import { useState } from 'react';
import LessonCard from "@/components/features/lessons/LessonCard";
import type { Lesson } from "@/models/lesson.model";
import { motion, AnimatePresence } from 'framer-motion';
import PaginationComponent from '@/components/common/PaginationComponent';

const MOCK_WISH_LESSONS: Lesson[] = [
    {
        id: 1,
        title: "쉽게 배우는 가죽 공예: 카드 지갑 만들기",
        description: "초보자도 2시간 만에 나만의 가공 지갑을 완성할 수 있습니다.",
        level: "초급",
        durationMin: 120,
        price: 45000,
        currentParticipants: 4,
        maxParticipants: 6,
        representativeImage: "https://images.unsplash.com/photo-1524333865983-81f2df99be7e?q=80&w=800&auto=format&fit=crop",
        regionId: 1,
        address: "서울시 강남구 역삼동 123-45",
        latitude: 37.4979,
        longitude: 127.0276,
        isSameDayReservable: true,
        rate: 4.8,
        isLiked: true,
        likes: 124,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        classCategory: { id: 1, name: "공예" },
        subClassCategory: { id: 1, categoryId: 1, name: "가죽공예" },
        teacherProfile: {
            id: 1,
            userId: 101,
            nickname: "레더마스터",
            introduction: "가죽 공예 10년 경력의 전문가입니다.",
            createdAt: "2023-01-01T00:00:00Z",
            updatedAt: "2023-01-01T00:00:00Z"
        },
        teacherProfileImages: []
    },
    {
        id: 2,
        title: "나만의 향수 만들기 원데이 클래스",
        description: "50가지 향료를 조합하여 세상에 하나뿐인 나만의 향기를 만드세요.",
        level: "초급",
        durationMin: 90,
        price: 55000,
        currentParticipants: 2,
        maxParticipants: 4,
        representativeImage: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop",
        regionId: 2,
        address: "서울시 마포구 연남동 567-89",
        latitude: 37.5612,
        longitude: 126.9246,
        isSameDayReservable: false,
        rate: 4.9,
        isLiked: true,
        likes: 89,
        createdAt: "2024-01-05T00:00:00Z",
        updatedAt: "2024-01-05T00:00:00Z",
        classCategory: { id: 2, name: "뷰티" },
        subClassCategory: { id: 2, categoryId: 2, name: "향수" },
        teacherProfile: {
            id: 2,
            userId: 102,
            nickname: "센트아티스트",
            introduction: "조향사 자격증을 보유한 전문 강사입니다.",
            createdAt: "2023-02-01T00:00:00Z",
            updatedAt: "2023-02-01T00:00:00Z"
        },
        teacherProfileImages: []
    },
    {
        id: 3,
        title: "오감을 깨우는 힐링 요가",
        description: "바쁜 일상 속에서 몸과 마음의 평화를 찾는 시간입니다.",
        level: "초급",
        durationMin: 60,
        price: 30000,
        currentParticipants: 5,
        maxParticipants: 10,
        representativeImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop",
        regionId: 3,
        address: "서울시 성동구 성수동 11-22",
        latitude: 37.5446,
        longitude: 127.0564,
        isSameDayReservable: true,
        rate: 4.7,
        isLiked: true,
        likes: 210,
        createdAt: "2024-01-10T00:00:00Z",
        updatedAt: "2024-01-10T00:00:00Z",
        classCategory: { id: 3, name: "운동/건강" },
        subClassCategory: { id: 3, categoryId: 3, name: "요가" },
        teacherProfile: {
            id: 3,
            userId: 103,
            nickname: "요가베어",
            introduction: "건강한 삶을 지향하는 요가 강사입니다.",
            createdAt: "2023-03-01T00:00:00Z",
            updatedAt: "2023-03-01T00:00:00Z"
        },
        teacherProfileImages: []
    },
    {
        id: 4,
        title: "감성 가득 수채화 클래스",
        description: "맑고 투명한 수채화의 매력에 빠져보세요.",
        level: "초급",
        durationMin: 120,
        price: 40000,
        currentParticipants: 3,
        maxParticipants: 8,
        representativeImage: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop",
        regionId: 1,
        address: "서울시 강남구 논현동 45-67",
        latitude: 37.5113,
        longitude: 127.0217,
        isSameDayReservable: true,
        rate: 4.6,
        isLiked: true,
        likes: 156,
        createdAt: "2024-01-15T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z",
        classCategory: { id: 4, name: "예술" },
        subClassCategory: { id: 4, categoryId: 4, name: "회화" },
        teacherProfile: {
            id: 4,
            userId: 104,
            nickname: "아티스트김",
            introduction: "그림으로 소통하는 아티스트입니다.",
            createdAt: "2023-04-01T00:00:00Z",
            updatedAt: "2023-04-01T00:00:00Z"
        },
        teacherProfileImages: []
    },
    {
        id: 5,
        title: "홈베이킹: 촉촉한 파운드 케이크",
        description: "집에서도 실패 없는 파운드 케이크 레시피를 전수해 드립니다.",
        level: "중급",
        durationMin: 150,
        price: 50000,
        currentParticipants: 2,
        maxParticipants: 4,
        representativeImage: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop",
        regionId: 4,
        address: "서울시 용산구 이태원동 88-99",
        latitude: 37.5345,
        longitude: 126.9945,
        isSameDayReservable: false,
        rate: 5.0,
        isLiked: true,
        likes: 342,
        createdAt: "2024-01-20T00:00:00Z",
        updatedAt: "2024-01-20T00:00:00Z",
        classCategory: { id: 5, name: "요리" },
        subClassCategory: { id: 5, categoryId: 5, name: "베이킹" },
        teacherProfile: {
            id: 5,
            userId: 105,
            nickname: "베이킹퀸",
            introduction: "달콤한 디저트를 만드는 베이킹 강사입니다.",
            createdAt: "2023-05-01T00:00:00Z",
            updatedAt: "2023-05-01T00:00:00Z"
        },
        teacherProfileImages: []
    },
    {
        id: 6,
        title: "초보를 위한 주식 투자 입문",
        description: "어려운 경제 용어부터 실전 투자까지 차근차근 알려드립니다.",
        level: "초급",
        durationMin: 180,
        price: 60000,
        currentParticipants: 10,
        maxParticipants: 20,
        representativeImage: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=800&auto=format&fit=crop",
        regionId: 1,
        address: "서울시 강남구 삼성동 159",
        latitude: 37.5126,
        longitude: 127.0589,
        isSameDayReservable: true,
        rate: 4.5,
        isLiked: true,
        likes: 567,
        createdAt: "2024-01-25T00:00:00Z",
        updatedAt: "2024-01-25T00:00:00Z",
        classCategory: { id: 6, name: "자기계발" },
        subClassCategory: { id: 6, categoryId: 6, name: "재테크" },
        teacherProfile: {
            id: 6,
            userId: 106,
            nickname: "스톡마스터",
            introduction: "15년 경력의 전직 펀드매니저입니다.",
            createdAt: "2023-06-01T00:00:00Z",
            updatedAt: "2023-06-01T00:00:00Z"
        },
        teacherProfileImages: []
    },
    {
        id: 7,
        title: "도자기 물레 체험: 나만의 그릇 만들기",
        description: "부드러운 흙을 만지며 힐링하는 도자기 체험 클래스입니다.",
        level: "초급",
        durationMin: 90,
        price: 48000,
        currentParticipants: 1,
        maxParticipants: 3,
        representativeImage: "https://images.unsplash.com/photo-1565191999001-551c187427bb?q=80&w=800&auto=format&fit=crop",
        regionId: 5,
        address: "서울시 종로구 삼청동 123",
        latitude: 37.5812,
        longitude: 126.9812,
        isSameDayReservable: false,
        rate: 4.9,
        isLiked: true,
        likes: 128,
        createdAt: "2024-02-01T00:00:00Z",
        updatedAt: "2024-02-01T00:00:00Z",
        classCategory: { id: 1, name: "공예" },
        subClassCategory: { id: 7, categoryId: 1, name: "도자공예" },
        teacherProfile: {
            id: 7,
            userId: 107,
            nickname: "클레이공방",
            introduction: "전통과 현대의 조화를 추구하는 도예가입니다.",
            createdAt: "2023-07-01T00:00:00Z",
            updatedAt: "2023-07-01T00:00:00Z"
        },
        teacherProfileImages: []
    }
];

const ITEMS_PER_PAGE = 6;

const WishList = () => {
    const [wishLessons, setWishLessons] = useState<Lesson[]>(MOCK_WISH_LESSONS);
    const [page, setPage] = useState(1);

    const totalPages = Math.ceil(wishLessons.length / ITEMS_PER_PAGE);
    const currentLessons = wishLessons.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    const handleToggleLike = (lessonId: number) => {
        // 실제 API 연동 시에는 여기서 삭제 요청을 보냄
        setWishLessons(prev => {
            const newList = prev.filter(lesson => lesson.id !== lessonId);
            const newTotalPages = Math.ceil(newList.length / ITEMS_PER_PAGE);
            if (page > newTotalPages && newTotalPages > 0) {
                setPage(newTotalPages);
            }
            return newList;
        });
    };

    return (
        <div className="max-w-6xl mx-auto w-full p-6 space-y-6 bg-white min-h-screen">
            {/* 헤더 영역 */}
            <div className="flex justify-between items-center mb-2">
                <h1 className="text-2xl font-bold text-foreground">위시리스트</h1>
            </div>

            <p className="text-gray-500 mb-6 font-medium">
                총 <span className="text-primary font-bold">{wishLessons.length}</span>개의 찜한 클래스가 있습니다.
            </p>

            {/* 위시리스트 그리드 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {currentLessons.map((lesson) => (
                        <motion.div
                            key={lesson.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className="w-full"
                        >
                            <LessonCard
                                lesson={lesson}
                                onToggleLike={() => handleToggleLike(lesson.id)}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* 빈 상태 */}
            {wishLessons.length === 0 && (
                <div className="flex flex-col items-center justify-center py-32 text-gray-400">
                    <p className="text-lg font-medium">찜한 클래스가 없습니다.</p>
                    <p className="text-sm">마음에 드는 클래스를 직접 찜해보세요!</p>
                </div>
            )}

            {/* 페이지네이션 */}
            {totalPages > 0 && (
                <div className="py-8">
                    <PaginationComponent
                        totalPages={totalPages}
                        page={page}
                        setPage={setPage}
                    />
                </div>
            )}
        </div>
    );
};

export default WishList;