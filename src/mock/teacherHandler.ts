import { delay, http, HttpResponse } from 'msw';

import { httpUrl, mockLessons, mockReviews } from './mockData/mockData';

// Mock 선생님 프로필 저장소
const teacherProfileStore = new Map<
	number,
	{
		id: number;
		nickname: string;
		image: string;
		introduction: string;
	}
>([
	[
		1,
		{
			id: 1,
			nickname: '김도예 멘토',
			image: 'https://picsum.photos/id/64/300/300',
			introduction:
				'도예 10년 경력의 베테랑 멘토입니다. 쉽고 재미있게 물레를 배우고 싶으신 분들을 환영합니다.도예 10년 경력의 베테랑 멘토입니다. 쉽고 재미있게 물레를 배우고 싶으신 분들을 환영합니다.도예 10년 경력의 베테랑 멘토입니다. 쉽고 재미있게 물레를 배우고 싶으신 분들을 환영합니다.도예 10년 경력의 베테랑 멘토입니다. 쉽고 재미있게 물레를 배우고 싶으신 분들을 환영합니다.도예 10년 경력의 베테랑 멘토입니다. 쉽고 재미있게 물레를 배우고 싶으신 분들을 환영합니다.도예 10년 경력의 베테랑 멘토입니다. 쉽고 재미있게 물레를 배우고 싶으신 분들을 환영합니다.',
		},
	],
	[
		2,
		{
			id: 2,
			nickname: '이그림 멘토',
			image: 'https://picsum.photos/id/65/300/300',
			introduction:
				'유화와 수채화를 전문으로 가르치고 있습니다. 나만의 예술적 감각을 깨워보세요.',
		},
	],
	[
		3,
		{
			id: 3,
			nickname: '박요리 멘토',
			image: 'https://picsum.photos/id/66/300/300',
			introduction: '한식부터 양식까지, 누구나 따라 할 수 있는 집밥 레시피를 공유합니다.',
		},
	],
]);

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

// 특정 모멘토가 받은 후기 조회
const getTeacherReviews = http.get(
	`${httpUrl}/teachers/:userId/reviews`,
	async ({ params, request }) => {
		try {
			const userId = Number(params.userId);
			const url = new URL(request.url);
			const page = Number(url.searchParams.get('page') || '1');
			const limit = Number(url.searchParams.get('limit') || '10');

			const teacherLessonIds = mockLessons
				.filter((lesson) => lesson.userId === userId || lesson.teacher.id === userId)
				.map((lesson) => lesson.id);

			const filteredReviews = mockReviews
				.filter((review) => teacherLessonIds.includes(review.lessonId))
				.map((review) => ({
					id: review.id,
					userId: review.user.id,
					rating: review.rating,
					content: review.content,
					representativeImage: review.representativeImage,
					createdAt: review.createdAt,
					user: review.user, // 작성자 정보 포함
				}));

			filteredReviews.sort(
				(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
			);

			const totalCount = filteredReviews.length;
			const totalPages = Math.ceil(totalCount / limit);
			const paginatedReviews = filteredReviews.slice((page - 1) * limit, page * limit);

			await delay(500);
			return HttpResponse.json(
				{
					data: paginatedReviews,
					meta: {
						totalCount,
						page,
						limit,
						totalPages,
					},
				},
				{ status: 200 },
			);
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
	getTeacherReviews,
];
