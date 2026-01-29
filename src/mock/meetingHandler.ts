import { http, HttpResponse, delay } from "msw";
import { mockMeetings, httpUrl } from "./mockData";
import type { MeetingMeta, CreateMeetingRequest } from "@/models/meeting.model";

export const meetingHandler = [
  // 모임 생성
  http.post(`${httpUrl}/meetings`, async ({ request }) => {
    await delay(500);
    const token = request.headers.get("Authorization");
    if (!token) {
      return HttpResponse.json(
        { message: "토큰이 없습니다." },
        { status: 401 }
      );
    }

    try {
      const body = (await request.json()) as CreateMeetingRequest;

      // 필수 필드 체크 (간단한 예시)
      if (!body.title || !body.address) {
        return HttpResponse.json(
          { message: "필수 정보가 누락되었습니다." },
          { status: 400 }
        );
      }

      // 도로명 주소 검증 Mock logic (예: "없는주소"가 포함되면 에러)
      if (body.address.includes("없는주소")) {
        return HttpResponse.json(
          { message: "도로명 주소를 찾을 수 없습니다." },
          { status: 400 }
        );
      }

      const newMeetingId = mockMeetings.length + 100; // 겹치지 않게

      return HttpResponse.json({
        success: true,
        meetingId: newMeetingId,
        message: "모임이 성공적으로 생성되었습니다."
      }, { status: 201 });

    } catch (error) {
      return HttpResponse.json(
        { message: "잘못된 요청입니다." },
        { status: 400 }
      );
    }
  }),

  // 모임 수정
  http.put(`${httpUrl}/meetings/:id`, async ({ request, params }) => {
    await delay(500);
    const { id } = params;
    const token = request.headers.get("Authorization");
    if (!token) {
      return HttpResponse.json(
        { message: "토큰이 없습니다." },
        { status: 401 }
      );
    }

    try {
      const body = (await request.json()) as CreateMeetingRequest;

      if (!body.title || !body.address) {
        return HttpResponse.json(
          { message: "필수 정보가 누락되었습니다." },
          { status: 400 }
        );
      }

      // 도로명 주소 검증 Mock logic
      if (body.address.includes("없는주소")) {
        return HttpResponse.json(
          { message: "도로명 주소를 찾을 수 없습니다." },
          { status: 400 }
        );
      }

      return HttpResponse.json({
        success: true,
        meetingId: Number(id),
        message: "모임이 성공적으로 수정되었습니다."
      }, { status: 200 });

    } catch (error) {
      return HttpResponse.json(
        { message: "잘못된 요청입니다." },
        { status: 400 }
      );
    }
  }),

  http.get(`${httpUrl}/meetings/:id`, async ({ params }) => {
    await delay(300);
    const { id } = params;

    // mockMeetings 또는 myMeetings에서 찾기
    const meeting = mockMeetings.find(m => m.meetingId === Number(id)); // Using mockMeetings as base

    // detail용 가짜 데이터 추가
    if (meeting) {
      return HttpResponse.json({
        id: meeting.meetingId,
        meetingImage: "https://via.placeholder.com/600x400",
        hostImage: "https://via.placeholder.com/50",
        title: meeting.title,
        description: "이것은 모임 상세 설명입니다. 자유롭게 수정해보세요!",
        interestId: meeting.interestId,
        interestName: meeting.interestName,
        maxParticipants: meeting.maxParticipants,
        currentParticipants: meeting.currentParticipants,
        meetingDate: meeting.meetingDate,
        location: {
          address: meeting.address,
          lat: 37.5665,
          lng: 126.9780
        },
        host: {
          nickname: "개최자 닉네임",
          bio: "호스트의 한줄 소개입니다."
        }
      } as any, { status: 200 });
    }

    // myMeetings에서 찾기 (HostMeeting에서 클릭 시 이쪽일 가능성 높음)
    // 실제로는 myMeetings도 상세 조회 API를 통해 데이터를 가져와야 함.
    // 여기서는 간단히 mock response 리턴

    return HttpResponse.json({
      id: Number(id),
      meetingImage: "https://via.placeholder.com/600x400",
      hostImage: "https://via.placeholder.com/50",
      title: "Mock Detail Title",
      description: "상세 설명 Mock 데이터입니다.",
      interestId: 3,
      interestName: "자기계발/공부",
      maxParticipants: 10,
      currentParticipants: 3,
      meetingDate: new Date().toISOString(),
      location: {
        address: "서울 어딘가",
        lat: 37.0,
        lng: 127.0
      },
      host: {
        nickname: "호스트 명",
        bio: "소개"
      }
    }, { status: 200 });
  }),
  http.get(`${httpUrl}/meetings`, async ({ request }) => {
    await delay(500);

    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const limit = Number(url.searchParams.get("limit")) || 10;
    const interestFilter = url.searchParams.get("interestFilter");

    // 필터링 로직
    let filteredMeetings = mockMeetings;
    if (interestFilter && interestFilter !== "ALL") {
      filteredMeetings = mockMeetings.filter(
        (meeting) => meeting.interestId === Number(interestFilter)
      );
    }

    // 페이지네이션 로직
    const totalCount = filteredMeetings.length;
    const totalPages = Math.ceil(totalCount / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMeetings = filteredMeetings.slice(startIndex, endIndex);

    const meta: MeetingMeta = {
      totalCount,
      totalPages,
      page,
      limit,
    };

    return HttpResponse.json(
      {
        data: paginatedMeetings,
        meta: meta,
      },
      { status: 200 }
    );
  }),
];
