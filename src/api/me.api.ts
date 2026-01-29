import type { ParticipationStatus } from "@/models/participation.model";
import { apiClient } from "./client"
import type { MeetingMeta } from "@/models/meeting.model";

export interface MyMeetingsResponse {
    meetingId: number;
    title: string;
    meetingImage: string;
    interestId: number;
    interestName: string;
    address: string;
    meetingDate: string;
    currentParticipants: number;
    maxParticipants: number;
    status: ParticipationStatus;
    isHost: boolean;
    isCompleted: boolean;
}

export interface MyMeetingsListResponse {
    data: MyMeetingsResponse[];
    meta: MeetingMeta;
}

// 내 모임 목록조회
export const getMyMeetings = async (view: 'joined' | 'hosted' | 'all', status: string, page = 1, limit = 5) => {
    try {
        const response = await apiClient.get<MyMeetingsListResponse>(`/meetings/me?view=${view}&status=${status}&page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error("getMyMeetings error:", error);
        throw error;
    }
}

// // 내 모임 정보 수정
// export const updateMyMeeting = async (data: FormData) => {
//     try {
//         return apiClient.put("/users/user-update", data);
//     } catch (error) {
//         console.error("updateMyMeeting error:", error);
//         throw error;
//     }
// }

// // 내 모임 정보 삭제
// export const deleteMyMeeting = async (meetingId: number) => {
//     try {
//         return apiClient.delete(`/users/user-update/${meetingId}`);
//     } catch (error) {
//         console.error("deleteMyMeeting error:", error);
//         throw error;
//     }
// }