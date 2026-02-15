import type { LessonCategory } from './lesson.model';
import type { Region } from './region.model';

export interface User {
	id: number;
	email: string;
	nickname: string;
	bio?: string | null;
	resetToken?: string;
	refreshToken?: string;
	profileImage?: string | null; // image > profile_image > profileImage로 변경
	region?: Region;
	point?: number;
	teacherProfile?: boolean;
	createdAt: Date;
	updatedAt?: Date;
}

export type UserInfo = Partial<User> & {
	interests: LessonCategory[];
	userId?: number;
};
