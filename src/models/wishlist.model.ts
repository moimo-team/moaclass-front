import type { Lesson, LessonCategory, TeacherProfile } from "./lesson.model";
import type { PaginationMeta } from "./pagination.model";
import type { Region } from "./region.model";

// // 위시리스트 클래스 아이템
// export interface WishlistLessonItem {
//     lessonId: number;
//     title: string;
//     image: string;
//     category: LessonCategory;
//     teacherNickname: string;
//     region: Region;
//     price: number;
// }

// lesson 모델에서 변환한 위시리스트 아이템
export type WishlistLessonItem = {
  lessonId: Lesson["id"];
  title: Lesson["title"];
  image: Lesson["representativeImage"];
  category: LessonCategory;
  teacherNickname: TeacherProfile["nickname"];
  region: Region;
  address: Lesson["address"];
  price: Lesson["price"];
  discountRate: Lesson["discountRate"]; // 할인율
  discountedPrice: Lesson["discountedPrice"]; // 할인된 가격
  likes: Lesson["likes"];
  rate: Lesson["rate"];
};

// 위시리스트 목록 조회 response
export interface WishlistResponse {
  data: WishlistLessonItem[];
  meta: PaginationMeta;
}

/**
 * WishlistLessonItem을 Lesson 타입으로 변환합니다.
 * LessonCard 컴포넌트에서 필요한 최소한의 필드만 채웁니다.
 */
export const convertWishlistItemToLesson = (
  item: WishlistLessonItem,
): Lesson => {
  return {
    id: item.lessonId,
    title: item.title,
    representativeImage: item.image,
    price: item.price,
    discountRate: item.discountRate,
    discountedPrice: item.discountedPrice,
    address: item.address,
    isLiked: true, // 위시리스트에 있는 항목이므로 true
    likes: item.likes,
    rate: item.rate,
    classCategory: item.category,
    teacherProfile: {
      id: 0, // API에서 제공하지 않으므로 기본값
      userId: 0,
      nickname: item.teacherNickname,
      image: "", // API에서 제공하지 않으므로 빈 문자열
      introduction: "",
      createdAt: "",
      updatedAt: "",
    },
    // LessonCard에서 직접 사용하지 않는 필수 필드들
    teacherId: 0,
    classCategoryId: item.category.id,
    description: "",
    curriculum: "",
    level: "BEGINNER",
    durationMin: 0,
    status: "ACTIVE",
    currentParticipants: 0,
    regionId: item.region.id,
    latitude: 0,
    longitude: 0,
    detailAddress: "",
    directionsText: "",
    reservationLeadDays: 0,
    createdAt: "",
    updatedAt: "",
  };
};
