import type { ClassCardData } from "@/models/class.model";

export const MOCK_CLASSES: ClassCardData[] = [
  {
    id: 1,
    title: "좋은 클래스입니다bbbbbbbbbbbbbbbbbbbbbbbbb",
    category: "베이킹",
    thumbnailImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
    status: "RECRUITING",
    createdAt: "2026. 1. 28 (수) 16:52",
  },
  {
    id: 2,
    title: "React 심화 과정",
    category: "IT",
    thumbnailImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop",
    status: "RECRUITING",
    createdAt: "2026. 1. 27 (화) 14:30",
  },
  {
    id: 3,
    title: "TypeScript 기초",
    category: "IT",
    thumbnailImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop",
    status: "CLOSED",
    createdAt: "2026. 1. 25 (월) 10:15",
  },
];
