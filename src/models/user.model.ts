import type { Interest } from "./interest.model";
import type { Region } from "./region.model";

export interface User {
  id: number;
  email: string;
  nickname: string;
  bio?: string | null;
  resetToken?: string;
  refreshToken?: string;
  profileImage?: string | null;  // image > profile_image > profileImage로 변경
  region?: Region;
  point?: number;
  createdAt: Date;
  updatedAt?: Date;
}

export type UserInfo = Partial<User> & {
  interests: Interest[];
  userId?: number;
}
