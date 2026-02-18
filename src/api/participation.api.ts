import type { Participant, ParticipationDetail } from '@/models/participation.model';

import { apiClient } from './client';

// 참여자 목록 조회 (일반 사용자용 - isHost 포함)
export const getParticipants = async (meetingId: number): Promise<Participant[]> => {
	const response = await apiClient.get<Participant[]>(`/meetings/${meetingId}/participants`);
	return response.data;
};

// 내 모임 신청자 목록 조회 (모임장용 - status 포함)
export const getParticipations = async (meetingId: number): Promise<ParticipationDetail[]> => {
	const response = await apiClient.get<ParticipationDetail[]>(
		`/meetings/${meetingId}/participations`,
	);
	return response.data;
};

// 개별 참여 승인
export const approveParticipation = async (
	meetingId: number,
	participationId: number,
): Promise<void> => {
	await apiClient.put(`/meetings/${meetingId}/participations/${participationId}/approve`);
};

// 개별 참여 거절
export const rejectParticipation = async (
	meetingId: number,
	participationId: number,
): Promise<void> => {
	await apiClient.put(`/meetings/${meetingId}/participations/${participationId}/reject`);
};

// 전체 참여 승인
export const approveAllParticipations = async (meetingId: number): Promise<void> => {
	await apiClient.put(`/meetings/${meetingId}/participations/approve-all`);
};

// 승인 취소
export const cancelApprovalParticipation = async (
	meetingId: number,
	participationId: number,
): Promise<void> => {
	await apiClient.put(`/meetings/${meetingId}/participations/${participationId}/cancel-approval`);
};

// 거절 취소
export const cancelRejectParticipation = async (
	meetingId: number,
	participationId: number,
): Promise<void> => {
	await apiClient.put(
		`/meetings/${meetingId}/participations/${participationId}/cancel-rejection`,
	);
};
