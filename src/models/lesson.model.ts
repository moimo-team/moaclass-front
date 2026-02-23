import type { PaginationMeta } from '@/models/pagination.model';
import type { Review } from '@/models/review.model';
import type { LessonScheduleStatus, Schedule } from '@/models/schedule.model';

export type Level = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

// 클래스 상태 타입
export type LessonStatus = 'ACTIVE' | 'INACTIVE' | 'DELETED' | 'DRAFT' | 'DUPLICATED';

// 클래스
export interface Lesson {
	id: number;
	userId: number;
	lessonCategoryId: number;
	lessonCategoryName: string;

	title: string;
	description: string; // 클래스 상세내용

	level: Level;
	durationMin: number; // 소요 시간 - 초 단위로 변경 예정
	curriculum: string; // 커리큘럼 (40자~600자)

	status: LessonStatus;
	price: number;
	discountRate: number;
	discountedPrice: number;
	maxParticipants: number;

	representativeImage: string; //리뷰 파트와 통일 예정
	likeCount: number;

	regionId: number;
	regionName: string;
	address: string;
	latitude: number;
	longitude: number;
	detailAddress: string; // 상세 주소
	directionsText: string; // 찾아오는 길

	reservationLeadDays: number; // 며칠 전 예약 가능 (0 = 당일 가능)

	rate: number; // 리뷰 점수 평균

	deletedAt: string | null;
	reviewAiSummary: string | null;

	createdAt: string;
	updatedAt: string;

	teacher: TeacherProfile;

	subCategories: {
		id: number;
		name: string;
	}[];

	schedules: Schedule[];

	// 관계 데이터 (optional)
	isLiked?: boolean; // 프론트 전용
	classCategory?: LessonCategory;
	subClassCategories?: LessonSubCategory[];
	teacherProfile?: TeacherProfile;
	lessonImages?: LessonImage[];
}

// 클래스 상세 정보
export interface LessonDetail extends Lesson {
	images: LessonImage[];
	reviews: Review[];
}

// 클래스 갤러리 이미지
export interface LessonImage {
	id: number;
	lessonId: number;
	image: string;
	sequence: number;
}

// 클래스 대분류 카테고리
export interface LessonCategory {
	id: number;
	name: string; // 운동, 미술 등
}

// 클래스 소분류 카테고리
export interface LessonSubCategory {
	id: number;
	categoryId: number;
	name: string; // 축구, 야구 등
}

// 선생님 프로필
export interface TeacherProfile {
	id: number;
	userId?: number;
	nickname: string; // 선생님 활동 닉네임/상호명
	image: string; // 선생님 프로필 이미지
	introduction?: string; // 40자~600자
	createdAt?: string;
	updatedAt?: string;
}

// 선생님 프로필 생성/수정 요청 타입
export interface TeacherProfileRequest {
	nickname: string;
	image: string;
	introduction: string;
}

// 클래스 목록 조회 params & response
export interface FetchLessonsParams {
	regionId?: number[];
	categoryId?: number;
	subCategoryId?: number[];
	level?: string[];
	days?: string[];
	timeRange?: string; // "HH-HH"
	minPrice?: number;
	maxPrice?: number;
	sort?: string;
	maxParticipants?: number;
	status?: string | string[];
	userId?: number;
	isLiked?: boolean;
	limit?: number;
}

export interface FetchLessonsResponse {
	data: Lesson[];
	meta: PaginationMeta;
}

// --- 클래스 등록 관련 Request 인터페이스 ---

// 통합된 클래스 생성/수정 요청 타입 (FormData로 변환 전의 원본 객체 타입으로 활용 가능)
export interface LessonCreateRequest {
	title: string;
	description: string;
	curriculum: string;
	lessonCategoryId: number;
	subCategoryIds: number[];
	level: Level;
	durationMin: number;
	price: number;
	discountRate: number;
	discountedPrice: number;
	maxParticipants: number;
	regionId: number;
	address: string;
	latitude: number;
	longitude: number;
	detailAddress?: string;
	directionsText?: string;
	reservationLeadDays: number;
	representativeImage?: File; // 파일 객체
	lessonImages?: File[]; // 파일 객체 배열
}

// --- 클래스 일정 관련 타입 ---
export interface LessonSchedule {
	id: number;
	lessonId: number;
	startAt: string;
	endAt: string;
	currentParticipants: number;
	status: LessonScheduleStatus;
	createdAt: string;
	updatedAt: string;
}

export interface LessonCreateScheduleRequest {
	startAt: string;
	endAt: string;
}

// 빌드 에러 방지를 위한 추가 타입
export interface ClassCardData {
	id: number;
	title: string;
	category: string;
	thumbnailImage: string;
	status: LessonStatus;
	createdAt: string;
	price: number;
	discountRate: number;
	discountedPrice: number;
}
