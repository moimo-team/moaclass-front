export const userStore = {
	userInfo: {
		id: 3,
		email: 'moimo@email.com',
		nickname: '테스터',
		bio: '소개글입니다',
		point: 42000,
		region: {
			id: 1,
			name: '서울',
		},
		interests: [
			{ id: 1, name: '핸드메이드' },
			{ id: 2, name: '쿠킹' },
			{ id: 4, name: '드로잉' },
		teacherProfile: true,
		profileImage: 'https://picsum.photos/id/111/300/300',
	},
	setUserInfo: (newInfo: any) => {
		userStore.userInfo = { ...userStore.userInfo, ...newInfo };
	},
	updatePoint: (amount: number) => {
		if (userStore.userInfo.point === undefined) {
			userStore.userInfo.point = 0;
		}
		userStore.userInfo.point += amount;
	},
};
