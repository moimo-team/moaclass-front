import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface StoreState {
	isLoggedIn: boolean;
	userId: number | null;
	nickname: string | null;
	email: string | null;
	accessToken: string | null;
	isTeacher: boolean;
	storeLogin: (
		user: { id: number; nickname: string; email: string; teacherProfile: boolean },
		accessToken: string,
	) => void;
	storeLogout: () => void;
	setAccessToken: (token: string) => void;
}

// export const useAuthStore = create<StoreState>((set) => ({
//     isLoggedIn: false,
//     nickname: null,
//     accessToken: null,
//     storeLogin: (nickname: string, accessToken: string) => set({ isLoggedIn: true, nickname, accessToken }),
//     storeLogout: () => set({ isLoggedIn: false, nickname: null, accessToken: null }),
//     setAccessToken: (accessToken: string) => {
//         set(() => ({ accessToken }));
//     }
// }));

export const useAuthStore = create<StoreState>()(
	persist(
		(set) => ({
			isLoggedIn: false,
			userId: null,
			nickname: null,
			email: null,
			accessToken: null,
			isTeacher: false,
			storeLogin: (
				user: { id: number; nickname: string; email: string; teacherProfile: boolean },
				accessToken: string,
			) =>
				set({
					isLoggedIn: true,
					userId: user.id,
					nickname: user.nickname,
					email: user.email,
					accessToken,
					isTeacher: user.teacherProfile,
				}),
			storeLogout: () =>
				set({
					isLoggedIn: false,
					userId: null,
					nickname: null,
					email: null,
					accessToken: null,
					isTeacher: false,
				}),
			setAccessToken: (accessToken: string) => {
				set(() => ({ accessToken }));
			},
		}),
		{
			name: 'auth-storage',
		},
	),
);
