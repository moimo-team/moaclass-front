import type { Participant, ParticipationDetail } from "@/models/participation.model";
import { apiClient } from "./client";


// 참여자 목록 조회 (일반 사용자용 - isHost 포함)
export const getParticipants = async (meetingId: number) => {
    try {
        const response = await apiClient.get<Participant[]>(`/meetings/${meetingId}/participants`);
        return response.data;
    } catch (error) {
        console.error("Error fetching participants:", error);
        throw error;
    }
};

// 내 모임 신청자 목록 조회 (모임장용 - status 포함)
export const getParticipations = async (meetingId: number) => {
    try {
        const response = await apiClient.get<ParticipationDetail[]>(`/meetings/${meetingId}/participations`);
        return response.data;
    } catch (error) {
        console.error("Error fetching participations:", error);
        throw error;
    }
};

// 개별 참여 승인
export const approveParticipation = async (meetingId: number, participationId: number) => {
    try {
        await apiClient.put(`/meetings/${meetingId}/participations/${participationId}/approve`);
    } catch (error) {
        console.error("Error approving participation:", error);
        throw error;
    }
};

// 개별 참여 거절
export const rejectParticipation = async (meetingId: number, participationId: number) => {
    try {
        await apiClient.put(`/meetings/${meetingId}/participations/${participationId}/reject`);
    } catch (error) {
        console.error("Error rejecting participation:", error);
        throw error;
    }
};

// 전체 참여 승인
export const approveAllParticipations = async (meetingId: number) => {
    try {
        await apiClient.put(`/meetings/${meetingId}/participations/approve-all`);
    } catch (error) {
        console.error("Error approving all participations:", error);
        throw error;
    }
};

// 승인 취소
export const cancelApprovalParticipation = async (meetingId: number, participationId: number) => {
    try {
        await apiClient.put(`/meetings/${meetingId}/participations/${participationId}/cancel-approval`);
    } catch (error) {
        console.error("Error cancelling participation:", error);
        throw error;
    }
};

// 거절 취소
export const cancelRejectParticipation = async (meetingId: number, participationId: number) => {
    try {
        await apiClient.put(`/meetings/${meetingId}/participations/${participationId}/cancel-rejection`);
    } catch (error) {
        console.error("Error cancelling participation:", error);
        throw error;
    }
};