import type { Lesson } from './lesson.model';
import type { PaginationMeta } from './pagination.model';

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

// 위시리스트 클래스 아이템 (백엔드 명세 반영)
export interface WishlistLessonItem {
	lessonId: Lesson['id'];
	title: Lesson['title'];
	image: Lesson['representativeImage'];
	categoryName: string; // 축소된 형태 반영
	teacherNickname: string;
	regionName: string;
	price: Lesson['price'];
}

// 위시리스트 목록 조회 response
export interface WishlistResponse {
	data: Lesson[];
	meta: PaginationMeta;
}

/**
 * WishlistLessonItem을 Lesson 타입으로 변환합니다.
 * LessonCard 컴포넌트에서 필요한 최소한의 필드만 채웁니다.
 */
export const convertWishlistItemToLesson = (item: WishlistLessonItem): Lesson => {
	return {
		id: item.lessonId,
		title: item.title,
		representativeImage: item.image,
		price: item.price,
		discountRate: 0, // 명세서에 없음
		discountedPrice: item.price, // 명세서에 없음
		address: '', // 명세서에 없음
		isLiked: true, // 위시리스트에 있는 항목이므로 true
		likeCount: 0,
		rate: 0,
		lessonCategoryName: item.categoryName,
		teacher: {
			id: 0,
			nickname: item.teacherNickname,
			image: '',
		},
		// LessonCard에서 직접 사용하지 않는 필수 필드들
		userId: 0,
		lessonCategoryId: 0,
		description: '',
		curriculum: '',
		level: 'BEGINNER',
		durationMin: 0,
		status: 'ACTIVE',
		maxParticipants: 0,
		regionId: 0,
		regionName: item.regionName,
		latitude: 0,
		longitude: 0,
		detailAddress: '',
		directionsText: '',
		reservationLeadDays: 0,
		deletedAt: null,
		reviewAiSummary: '',
		subCategories: [],
		schedules: [],
		createdAt: '',
		updatedAt: '',
	};
};
