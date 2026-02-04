import type { ClassCardData } from "@/models/lesson.model";

export const MOCK_CLASSES: ClassCardData[] = [
  {
    id: 1,
    title: "[운영중] 좋은 클래스입니다",
    category: "베이킹",
    thumbnailImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
    status: "ACTIVE",
    createdAt: "2026. 2. 4 (화) 10:00",
  },
  {
    id: 2,
    title: "[운영중] React 심화 과정",
    category: "IT",
    thumbnailImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop",
    status: "ACTIVE",
    createdAt: "2026. 2. 3 (월) 14:30",
  },
  {
    id: 3,
    title: "[휴면] TypeScript 기초",
    category: "IT",
    thumbnailImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop",
    status: "INACTIVE",
    createdAt: "2026. 2. 2 (일) 09:15",
  },
  {
    id: 4,
    title: "[삭제됨(보이면안됨)] 파이썬 입문",
    category: "IT",
    thumbnailImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop",
    status: "DELETED",
    createdAt: "2026. 2. 1 (토) 11:20",
  },
  {
    id: 5,
    title: "[임시저장됨] 요가 클래스",
    category: "운동",
    thumbnailImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop",
    status: "DRAFT",
    createdAt: "2026. 1. 31 (금) 16:45",
  },
  {
    id: 6,
    title: "[복제됨] 좋은 클래스입니다 (복제)",
    category: "베이킹",
    thumbnailImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
    status: "DUPLICATED",
    createdAt: "2026. 1. 30 (목) 13:10",
  },
];
