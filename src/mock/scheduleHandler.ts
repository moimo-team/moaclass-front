import { http, HttpResponse } from 'msw';
import { httpUrl } from './mockData/mockData';
import type {
  LessonSchedule,
  ScheduleParticipant,
} from '@/models/schedule.model';

let mockSchedules: LessonSchedule[] = [
  {
    id: 1,
    lessonId: 1,
    startAt: '2026-02-15T14:00:00',
    endAt: '2026-02-15T16:00:00',
    currentParticipants: 2,
    maxParticipants: 4,
    createdAt: '2026-02-10T10:00:00',
  },
  {
    id: 2,
    lessonId: 1,
    startAt: '2026-02-15T18:00:00',
    endAt: '2026-02-15T20:00:00',
    currentParticipants: 0,
    maxParticipants: 4,
    createdAt: '2026-02-10T10:00:00',
  },
  {
    id: 3,
    lessonId: 1,
    startAt: '2026-02-16T14:00:00',
    endAt: '2026-02-16T16:00:00',
    currentParticipants: 1,
    maxParticipants: 4,
    createdAt: '2026-02-10T10:00:00',
  },
];

const mockParticipantsBySchedule: Record<number, ScheduleParticipant[]> = {
  1: [
    {
      userId: 101,
      nickname: '김모아',
      profileImage: null,
    },
    {
      userId: 102,
      nickname: '이클래스',
      profileImage: null,
    },
  ],
  3: [
    {
      userId: 103,
      nickname: '박지용',
      profileImage: null,
    },
  ],
};

export const scheduleHandlers = [
  http.get(`${httpUrl}/lessons/:lessonId/schedules`, ({ params }) => {
    const { lessonId } = params;
    const filtered = mockSchedules.filter(
      (s) => s.lessonId === Number(lessonId),
    );
    return HttpResponse.json(filtered);
  }),

  http.post(
    `${httpUrl}/lessons/:lessonId/schedules`,
    async ({ request, params }) => {
      const { lessonId } = params;
      const body = (await request.json()) as Array<{
        startAt: string;
        endAt: string;
      }>;

      const newSchedules = body.map((item, index) => ({
        id: mockSchedules.length + index + 100,
        lessonId: Number(lessonId),
        startAt: item.startAt,
        endAt: item.endAt,
        currentParticipants: 0,
        maxParticipants: 4,
        createdAt: new Date().toISOString(),
      }));

      mockSchedules = [...mockSchedules, ...newSchedules];
      return HttpResponse.json({ message: '등록 성공' }, { status: 201 });
    },
  ),

  http.get(
    `${httpUrl}/lessons/schedules/:scheduleId/participants`,
    ({ params }) => {
      const { scheduleId } = params;
      const participants = mockParticipantsBySchedule[Number(scheduleId)] || [];
      return HttpResponse.json(participants);
    },
  ),

  http.delete(`${httpUrl}/lessons/schedules/:scheduleId`, ({ params }) => {
    const { scheduleId } = params;
    const schedule = mockSchedules.find((s) => s.id === Number(scheduleId));

    if (!schedule) {
      return HttpResponse.json(
        { message: '일정을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    if (schedule.currentParticipants > 0) {
      return HttpResponse.json(
        { message: '신청자가 있어 삭제할 수 없습니다.' },
        { status: 400 },
      );
    }

    mockSchedules = mockSchedules.filter((s) => s.id !== Number(scheduleId));
    return new HttpResponse(null, { status: 204 });
  }),

  http.delete(`${httpUrl}/lessons/schedules`, async ({ request }) => {
    const { scheduleIds } = (await request.json()) as { scheduleIds: number[] };

    if (!scheduleIds || !Array.isArray(scheduleIds)) {
      return HttpResponse.json(
        { message: '잘못된 요청입니다.' },
        { status: 400 },
      );
    }

    const hasParticipants = mockSchedules.some(
      (s) => scheduleIds.includes(s.id) && s.currentParticipants > 0,
    );

    if (hasParticipants) {
      return HttpResponse.json(
        { message: '신청자가 있는 일정은 삭제할 수 없습니다.' },
        { status: 400 },
      );
    }

    mockSchedules = mockSchedules.filter((s) => !scheduleIds.includes(s.id));
    return new HttpResponse(null, { status: 204 });
  }),
];
