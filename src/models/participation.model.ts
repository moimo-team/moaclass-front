import type { Interest } from "./interest.model";

export type Attendance = 'ATTENDANCE' | 'ABSENT';                      // 출석체크 : 참석, 결석
export type ParticipationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED'; // 참여상태 : 대기, 승인, 거절

export interface Participation {
    id: number;
    userId: number;
    meetingId: number;
    status: ParticipationStatus;
    checkedIn: Attendance;
    createdAt: Date;
    updatedAt?: Date;
}

// 참여자 목록 조회용 
export interface Participant {
    userId: number;
    nickname: string;
    profileImage: string | null;
    bio: string | null;
    isHost: boolean;
}

// 참여 관리용 
export interface ParticipationDetail {
    participationId: number;
    userId: number;
    nickname: string;
    profileImage: string | null;
    status: ParticipationStatus;
    bio: string | null;
    interests?: Interest[];
}