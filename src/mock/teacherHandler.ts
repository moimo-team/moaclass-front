import { delay, http, HttpResponse } from 'msw';

import { httpUrl } from './mockData/mockData';

// Mock 선생님 프로필 저장소
const teacherProfileStore = new Map<
	number,
	{
		id: number;
		nickname: string;
		image: string;
		introduction: string;
	}
>();

// 선생님 프로필 등록
const createTeacherProfile = http.post(`${httpUrl}/teachers`, async ({ request }) => {
	try {
		const authHeader = request.headers.get('Authorization');
		if (!authHeader) {
			return new HttpResponse(null, { status: 401 });
		}

		const formData = await request.formData();
		const nickname = formData.get('nickname') as string;
		const introduction = formData.get('introduction') as string;
		const imageFile = formData.get('image');

		// 닉네임 중복 체크
		const isDuplicate = Array.from(teacherProfileStore.values()).some(
			(profile) => profile.nickname === nickname,
		);

		if (isDuplicate) {
			return new HttpResponse(JSON.stringify({ message: '이미 사용 중인 닉네임입니다.' }), {
				status: 409,
			});
		}

		// Mock 이미지 URL 생성
		let imageUrl = 'https://picsum.photos/id/64/300/300';
		if (imageFile && imageFile instanceof File) {
			imageUrl = URL.createObjectURL(imageFile);
		}

		// Mock userId (실제로는 토큰에서 추출)
		const userId = 3;

		const newProfile = {
			id: userId,
			nickname,
			image: imageUrl,
			introduction,
		};

		teacherProfileStore.set(userId, newProfile);

		await delay(1000);
		return new HttpResponse(null, { status: 201 });
	} catch {
		return new HttpResponse(null, { status: 500 });
	}
});

// 선생님 프로필 수정
const updateTeacherProfile = http.put(`${httpUrl}/teachers`, async ({ request }) => {
	try {
		const authHeader = request.headers.get('Authorization');
		if (!authHeader) {
			return new HttpResponse(null, { status: 401 });
		}

		const formData = await request.formData();
		const nickname = formData.get('nickname') as string;
		const introduction = formData.get('introduction') as string;
		const imageFile = formData.get('image');

		// Mock userId (실제로는 토큰에서 추출)
		const userId = 3;

		const existingProfile = teacherProfileStore.get(userId);
		if (!existingProfile) {
			return new HttpResponse(JSON.stringify({ message: '프로필을 찾을 수 없습니다.' }), {
				status: 404,
			});
		}

		// 닉네임 중복 체크 (자기 자신 제외)
		const isDuplicate = Array.from(teacherProfileStore.entries()).some(
			([id, profile]) => id !== userId && profile.nickname === nickname,
		);

		if (isDuplicate) {
			return new HttpResponse(JSON.stringify({ message: '이미 사용 중인 닉네임입니다.' }), {
				status: 409,
			});
		}

		// 이미지 업데이트
		let imageUrl = existingProfile.image;
		if (imageFile && imageFile instanceof File) {
			imageUrl = URL.createObjectURL(imageFile);
		}

		const updatedProfile = {
			...existingProfile,
			nickname,
			image: imageUrl,
			introduction,
		};

		teacherProfileStore.set(userId, updatedProfile);

		await delay(1000);
		return new HttpResponse(null, { status: 204 });
	} catch {
		return new HttpResponse(null, { status: 500 });
	}
});

// 선생님 프로필 조회
const getTeacherProfile = http.get(`${httpUrl}/teachers/:userId`, async ({ params }) => {
	try {
		const userId = Number(params.userId);

		const profile = teacherProfileStore.get(userId);

		if (!profile) {
			return new HttpResponse(JSON.stringify({ message: '프로필을 찾을 수 없습니다.' }), {
				status: 404,
			});
		}

		await delay(500);
		return HttpResponse.json(profile, { status: 200 });
	} catch {
		return new HttpResponse(null, { status: 500 });
	}
});

// 선생님 프로필 삭제
const deleteTeacherProfile = http.delete(
	`${httpUrl}/teachers/:userId`,
	async ({ request, params }) => {
		try {
			const authHeader = request.headers.get('Authorization');
			if (!authHeader) {
				return new HttpResponse(null, { status: 401 });
			}

			const userId = Number(params.userId);

			const profile = teacherProfileStore.get(userId);
			if (!profile) {
				return new HttpResponse(JSON.stringify({ message: '프로필을 찾을 수 없습니다.' }), {
					status: 404,
				});
			}

			teacherProfileStore.delete(userId);

			await delay(500);
			return new HttpResponse(null, { status: 204 });
		} catch {
			return new HttpResponse(null, { status: 500 });
		}
	},
);

export const teacherHandler = [
	createTeacherProfile,
	updateTeacherProfile,
	getTeacherProfile,
	deleteTeacherProfile,
];
