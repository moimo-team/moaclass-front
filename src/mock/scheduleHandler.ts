import { http, HttpResponse } from 'msw';
import type { LessonSchedule } from '@/models/schedule.model';

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

export const scheduleHandlers = [
  http.get('/api/lessons/:lessonId/schedules', ({ params }) => {
    const { lessonId } = params;
    const filtered = mockSchedules.filter(
      (s) => s.lessonId === Number(lessonId),
    );

    return HttpResponse.json(filtered);
  }),

  http.post('/api/lessons/:lessonId/schedules', async ({ request, params }) => {
    const { lessonId } = params;
    const body = (await request.json()) as Array<{
      startAt: string;
      endAt: string;
    }>;

    const newSchedules = body.map((item, index) => ({
      id: mockSchedules.length + index + 1,
      lessonId: Number(lessonId),
      startAt: item.startAt,
      endAt: item.endAt,
      currentParticipants: 0,
      maxParticipants: 4,
      createdAt: new Date().toISOString(),
    }));

    mockSchedules = [...mockSchedules, ...newSchedules];

    return HttpResponse.json({ message: '등록 성공' }, { status: 201 });
  }),

  http.delete('/api/lessons/schedules/:scheduleId', ({ params }) => {
    const { scheduleId } = params;
    const schedule = mockSchedules.find((s) => s.id === Number(scheduleId));

    if (!schedule) {
      return HttpResponse.json(
        { message: '일정을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    // TODO: 실제로는 로그인한 사용자와 클래스 소유자 비교 필요
    // Mock에서는 scheduleId가 999일 때 권한 없음으로 가정
    if (Number(scheduleId) === 999) {
      return HttpResponse.json(
        { message: '본인이 개설한 클래스가 아닙니다.' },
        { status: 403 },
      );
    }

    if (schedule.currentParticipants > 0) {
      return HttpResponse.json(
        { message: '신청자가 있어 삭제할 수 없습니다.' },
        { status: 400 },
      );
    }

    return new HttpResponse(null, { status: 204 });
  }),
];
