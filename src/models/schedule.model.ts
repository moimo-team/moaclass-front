export interface LessonSchedule {
  id: number;
  lessonId: number;
  startAt: string; // ISO 8601 (예: "2026-02-24T14:00:00")
  endAt: string;
  currentParticipants: number;
  maxParticipants: number;
  createdAt: string;
}

export interface CreateScheduleRequest {
  startAt: string;
  endAt: string;
}

export interface SchedulesByDate {
  [date: string]: LessonSchedule[]; // "2026-02-10": [...]
}

export interface RecurringScheduleFormData {
  startDate: Date;
  endDate: Date;
  startTime: string; // "14:00"
  endTime: string; // "16:00"
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
}
