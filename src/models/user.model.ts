import type { Interest } from "./interest.model";

export interface User {
  id: number;
  email: string;
  nickname: string;
  bio?: string | null;
  resetToken?: string;
  refreshToken?: string;
  profileImage?: string | null;  // image > profile_image > profileImage로 변경
  regionId?: number | null;
  createdAt: Date;
  updatedAt?: Date;
}

export type UserInfo = Partial<User> & {
  categories: Interest[];
  userId?: number;
}

export interface SocialAccounts {
  id: number;
  googleSubId: string;
  userId: number;
  createdAt: Date;
  updatedAt?: Date;
}
