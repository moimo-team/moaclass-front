import { apiClient } from '@/api/client';
import type {
	MeetingListResponse,
	MeetingDetail,
	CreateMeetingResponse,
} from '@/models/meeting.model';

export type SortType = 'NEW' | 'UPDATE' | 'DEADLINE';
export type InterestFilterType = string;
export type FinishedFilterType = boolean;

export interface GetMeetingsParams {
	page?: number;
	limit?: number;
	sort?: SortType;
	interestFilter?: InterestFilterType;
	finishedFilter?: FinishedFilterType;
}

// 백엔드 데이터를 프론트엔드 모델로 변환하는 어댑터
const convertToFrontendModel = async <T>(data: T): Promise<T> => {
	if (!data) return data;

	if (Array.isArray(data)) {
		const results = await Promise.all(data.map((item) => convertToFrontendModel(item)));
		return results as unknown as T;
	}

	if (typeof data === 'object' && data !== null) {
		const converted = { ...data } as Record<string, unknown>;

		// interestId 매핑: categoryId가 있고 interestId가 없으면 복사
		if ('categoryId' in data && !('interestId' in data)) {
			converted.interestId = (data as Record<string, unknown>).categoryId;
		}

		// interestName 매핑: categoryName이 있고 interestName이 없으면 복사
		if ('categoryName' in data && !('interestName' in data)) {
			converted.interestName = (data as Record<string, unknown>).categoryName;
		}

		// 이름이 여전히 없고 ID가 있는 경우, 관심사 목록에서 직접 찾기 (상세조회 등)
		if (
			!converted.interestName &&
			(converted.interestId || (data as Record<string, unknown>).interestId)
		) {
			const { getInterests } = await import('./interest.api');
			const interests = await getInterests();
			const targetId = converted.interestId || (data as Record<string, unknown>).interestId;
			const interest = interests.find((i) => i.id === targetId);
			if (interest) {
				converted.interestName = interest.name;
			}
		}

		// 재귀적으로 내부 객체도 변환 (location, host 등)
		for (const key of Object.keys(converted)) {
			const value = converted[key];
			if (value !== null && typeof value === 'object') {
				converted[key] = await convertToFrontendModel(value);
			}
		}
		return converted as unknown as T;
	}

	return data;
};

export const getMeetings = async (params?: GetMeetingsParams): Promise<MeetingListResponse> => {
	try {
		const queryParams = new URLSearchParams();
		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					queryParams.append(key, String(value));
				}
			});
		}
		// url에 쿼리 적용
		const queryString = queryParams.toString();
		const url = queryString ? `/meetings?${queryString}` : '/meetings';

		const response = await apiClient.get<MeetingListResponse>(url);

		// 데이터 변환 적용
		if (response.data && response.data.data) {
			response.data.data = await convertToFrontendModel(response.data.data);
		}

		return response.data;
	} catch (error) {
		console.error('getMeetings error:', error);
		throw error;
	}
};

export interface SearchMeetingsParams {
	keyword: string;
	page?: number;
	limit?: number;
}

export const searchMeetings = async (
	params: SearchMeetingsParams,
): Promise<MeetingListResponse> => {
	try {
		const queryParams = new URLSearchParams();
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				queryParams.append(key, String(value));
			}
		});

		const queryString = queryParams.toString();
		const url = `/meetings/search?${queryString}`;

		const response = await apiClient.get<MeetingListResponse>(url);

		// 데이터 변환 적용
		if (response.data && response.data.data) {
			response.data.data = await convertToFrontendModel(response.data.data);
		}

		return response.data;
	} catch (error) {
		console.error('searchMeetings error:', error);
		throw error;
	}
};

// 모임 상세 조회 API
export const getMeetingById = async (meetingId: string | number): Promise<MeetingDetail> => {
	try {
		const response = await apiClient.get<MeetingDetail>(`/meetings/${meetingId}`);

		// 데이터 변환 적용 (비동기)
		if (response.data) {
			return await convertToFrontendModel(response.data);
		}

		return response.data; // 백엔드가 직접 모임 데이터를 반환
	} catch (error) {
		console.error('getMeetingById error:', error);
		throw error;
	}
};

// 이미지 업로드 API (클라우드 업로드)
export const uploadImage = async (file: File): Promise<string> => {
	try {
		const formData = new FormData();
		formData.append('image', file);

		const response = await apiClient.post<{ imageUrl: string }>(
			'/upload/image', // 클라우드 업로드 API
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			},
		);

		return response.data.imageUrl;
	} catch (error) {
		console.error('uploadImage error:', error);
		throw error;
	}
};

// 모임 생성 API (multipart/form-data 형식)
export const createMeeting = async (data: FormData): Promise<CreateMeetingResponse> => {
	try {
		const response = await apiClient.post<CreateMeetingResponse>('/meetings', data);

		return response.data;
	} catch (error) {
		console.error('createMeeting error:', error);
		throw error;
	}
};

// 모임 수정 API (multipart/form-data 형식)
export const updateMeeting = async (
	meetingId: number,
	data: FormData,
): Promise<CreateMeetingResponse> => {
	try {
		const response = await apiClient.put<CreateMeetingResponse>(`/meetings/${meetingId}`, data);
		return response.data;
	} catch (error) {
		console.error('updateMeeting error:', error);
		throw error;
	}
};

// 모임 참가 신청 API
export const joinMeeting = async (meetingId: number): Promise<void> => {
	try {
		await apiClient.post(`/meetings/${meetingId}/participations`);
	} catch (error) {
		console.error('joinMeeting error:', error);
		throw error;
	}
};

// 모임 삭제 API
export const deleteMeeting = async (meetingId: number): Promise<void> => {
	try {
		await apiClient.delete(`/meetings/${meetingId}`);
	} catch (error) {
		console.error('deleteMeeting error:', error);
		throw error;
	}
};
