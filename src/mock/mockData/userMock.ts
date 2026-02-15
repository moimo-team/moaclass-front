export const userStore = {
	userInfo: {
		id: 3,
		email: 'moimo@email.com',
		nickname: '테스터',
		bio: '소개글입니다',
		point: 42000,
		// regionId: 1,
		region: {
			id: 1,
			name: '서울',
		},
		teacherProfile: false,
		interests: [
			{ id: 1, name: '인간관계(친목)' },
			{ id: 2, name: '술' },
			{ id: 3, name: '자기계발/공부' },
		],
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
