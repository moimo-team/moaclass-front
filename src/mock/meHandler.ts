import { http, HttpResponse, delay } from 'msw';
import { httpUrl, myMeetings } from './mockData';

// 내 모임 목록조회 핸들러
export const getMyMeetings = http.get(`${httpUrl}/meetings/me`, async ({ request }) => {
    await delay(1000);

    const url = new URL(request.url);
    const view = url.searchParams.get("view") || "all";
    const status = url.searchParams.get("status") || "all";
    const page = Number(url.searchParams.get("page")) || 1;
    const limit = Number(url.searchParams.get("limit")) || 5;

    // 1. 참여/주최 필터링
    let filteredMeetings = myMeetings;
    if (view === 'joined') {
        filteredMeetings = filteredMeetings.filter(m => !m.isHost);
    } else if (view === 'hosted') {
        filteredMeetings = filteredMeetings.filter(m => m.isHost);
    }

    // 2. 상태 필터링
    if (status !== "all") {
        if (status === "pending") {
            filteredMeetings = filteredMeetings.filter(m => m.status === "PENDING");
        } else if (status === "accepted") {
            filteredMeetings = filteredMeetings.filter(m => m.status === "ACCEPTED" && !m.isCompleted);
        } else if (status === "completed") {
            filteredMeetings = filteredMeetings.filter(m => m.isCompleted);
        }
    }

    // 페이지네이션 로직
    const totalCount = filteredMeetings.length;
    const totalPages = Math.ceil(totalCount / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMeetings = filteredMeetings.slice(startIndex, endIndex);

    return HttpResponse.json(
        {
            data: paginatedMeetings,
            meta: {
                totalCount,
                page,
                limit,
                totalPages
            }
        },
        { status: 200 }
    );
});