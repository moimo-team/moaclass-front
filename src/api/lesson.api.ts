import { apiClient } from '@/api/client';
import type {
	FetchLessonsParams,
	FetchLessonsResponse,
	Lesson,
	LessonDetail,
} from '@/models/lesson.model';

// --- 클래스 조회(GET) 관련 ---

export const fetchLatestLessons = async (): Promise<Lesson[]> => {
	const response = await apiClient.get<FetchLessonsResponse>('/lessons', {
		params: { limit: 10 },
	});
	return response.data.data;
};

export const fetchLessons = async (params: FetchLessonsParams): Promise<FetchLessonsResponse> => {
	const queryParams = new URLSearchParams();

	Object.entries(params).forEach(([key, value]) => {
		if (value === undefined || value === null || value === '') return;

		// 백엔드 DTO의 @Transform 로직에 맞춰
		// 배열 데이터는 쉼표로 구분된 하나의 문자열로 직렬화하여 전송합니다.
		if (Array.isArray(value)) {
			queryParams.append(key, value.map(String).join(','));
		} else {
			queryParams.append(key, String(value));
		}
	});

	const queryString = queryParams.toString();
	const response = await apiClient.get<FetchLessonsResponse>(
		queryString ? `/lessons?${queryString}` : '/lessons',
	);
	return response.data;
};

export const fetchLesson = async (lessonId: number): Promise<LessonDetail> => {
	const response = await apiClient.get<LessonDetail>(`/lessons/${lessonId}`);
	return response.data;
};

// --- 클래스 생성/수정/삭제 관련 ---

// 1. 클래스 생성
export const createLesson = async (formData: FormData) => {
	const response = await apiClient.post('/lessons', formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
	return response.data;
};

// 2. 클래스 수정
export const updateLesson = async (lessonId: number, formData: FormData) => {
	const response = await apiClient.put(`/lessons/${lessonId}`, formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
	return response.data;
};

// 3. 레슨 삭제
export const deleteLesson = async (lessonId: number) => {
	const response = await apiClient.delete(`/lessons/${lessonId}`);
	return response.data;
};
