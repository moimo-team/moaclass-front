export type Level = "초급" | "중급" | "고급";

export interface ClassCategory {
  id: number;
  name: string;
}

export interface SubClassCategory {
  id: number;
  categoryId: number;
  name: string;
}

export interface TeacherProfile {
  id: number;
  userId: number;
  nickname: string;
  introduction: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherProfileImage {
  id: number;
  profileId: number;
  imageUrl: string;
  sequence: number;
}

export interface Lesson {
  id: number;
  title: string;
  description: string;

  level: Level;
  durationMin: number; // 소요 시간(분 단위)

  price: number;
  maxParticipants?: number;
  currentParticipants: number;

  representativeImage: string; // 클래스 대표 이미지

  regionId: number; // 지역 참조값
  address: string;
  latitude: number;
  longitude: number;
  detailAddress?: string;
  directionsText?: string; // 찾아오는 길

  isSameDayReservable: boolean; // 당일 예약 가능 여부

  rate: number; // 리뷰 점수 평균

  reviewAiSummary?: string;
  createdAt: string;
  updatedAt: string;
  isLiked: boolean;
  likes: number;

  classCategory: ClassCategory;
  subClassCategory: SubClassCategory;
  teacherProfile: TeacherProfile;
  teacherProfileImages: TeacherProfileImage[];
}
