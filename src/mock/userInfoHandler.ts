import { http, HttpResponse, delay } from 'msw';
import { httpUrl } from './mockData';

let mockMemberInfo = {
    id: 4,
    email: "moimi@email.com",
    nickname: "모이미지롱",
    bio: "소개글입니다222",
    interests: [
        { id: 1, name: "인간관계(친목)" },
        { id: 2, name: "술" },
        { id: 3, name: "자기계발/공부" }
    ],
    profileImage: "https://picsum.photos/id/111/300/300"
};

const getUserInfoById = http.get(`${httpUrl}/users/:userId`, async ({ params }) => {
    await delay(1000);
    const { userId } = params;

    if (userId === "4") {
        return HttpResponse.json({
            ...mockMemberInfo,  // 모든 사용자 정보 포함
        }, {
            status: 200,
        });
    } else {
        return HttpResponse.json({
            message: "사용자를 찾을 수 없습니다.",
        }, {
            status: 404,
        });
    }
});

export const userInfoHandler: any[] = [getUserInfoById];