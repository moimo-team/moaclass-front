import { fakerKO as faker } from "@faker-js/faker";
import type { MyMeetingsResponse } from "@/api/me.api";
import type { Interest } from "@/models/interest.model";
import type { Meeting } from "@/models/meeting.model";
import type {
  ParticipationDetail,
  ParticipationStatus,
} from "@/models/participation.model";
import { interestImageMap } from "@/utils/interestImageMap"; // Import interestImageMap

export const httpUrl =
  import.meta.env.VITE_API_URL || "https://moimo-back.vercel.app";

export const interestCategories: Interest[] = [
  {
    id: 1,
    name: "인간관계(친목)",
  },
  {
    id: 2,
    name: "술",
  },
  {
    id: 3,
    name: "자기계발/공부",
  },
  {
    id: 4,
    name: "예술",
  },
  {
    id: 5,
    name: "스포츠/운동",
  },
  {
    id: 6,
    name: "음식",
  },
  {
    id: 7,
    name: "라이프",
  },
  {
    id: 8,
    name: "공예/만들기",
  },
  {
    id: 9,
    name: "책/글쓰기/독서",
  },
  {
    id: 10,
    name: "차/음료",
  },
  {
    id: 11,
    name: "커리어/직장",
  },
  {
    id: 12,
    name: "재테크",
  },
  {
    id: 13,
    name: "반려동물",
  },
  {
    id: 14,
    name: "게임/액티비티",
  },
  {
    id: 15,
    name: "여행",
  },
  {
    id: 16,
    name: "심리/상담",
  },
  {
    id: 17,
    name: "인테리어/가구",
  },
  {
    id: 18,
    name: "건강",
  },
  {
    id: 19,
    name: "환경",
  },
  {
    id: 20,
    name: "엔터",
  },
  {
    id: 21,
    name: "미용",
  },
  {
    id: 22,
    name: "트렌드",
  },
  {
    id: 23,
    name: "연애/이성관계",
  },
  {
    id: 24,
    name: "식물/자연",
  },
];

export const mockMeetings: Meeting[] = Array.from({ length: 25 }, (_, i) => {
  const interest = interestCategories[i % interestCategories.length];
  return {
    meetingId: i + 1,
    title: `모임 제목 ${i + 1}`,
    meetingImage: interestImageMap[interest.name] || faker.image.urlLoremFlickr({ category: 'meeting' }), // Add meetingImage
    interestId: interest.id,
    interestName: interest.name,
    maxParticipants: 10,
    currentParticipants: i % 10,
    address: `서울시 강남구 역삼동 ${i + 1}번지`,
    meetingDate: `2024-03-${String((i % 28) + 1).padStart(2, "0")}T1${i % 9}:00:00`,
  };
});

// 내 참여모임
export const myMeetings: MyMeetingsResponse[] = Array.from(
  { length: 60 },
  (_, i) => {
    const isHost = i % 3 === 0;
    const isCompleted = i % 2 === 0;
    const status: ParticipationStatus =
      i % 4 === 0 ? "PENDING" : i % 5 === 0 ? "REJECTED" : "ACCEPTED";
    const interest = interestCategories[i % interestCategories.length];

    return {
      meetingId: 101 + i,
      title: faker.company.catchPhrase(),
      meetingImage: faker.image.urlLoremFlickr({ category: "meeting" }),
      interestId: interest.id,
      interestName: interest.name,
      address: `${faker.location.city()} ${faker.location.street()}`,
      meetingDate: faker.date.future().toISOString(),
      currentParticipants: faker.number.int({ min: 1, max: 10 }),
      maxParticipants: faker.number.int({ min: 10, max: 20 }),
      status,
      isHost,
      isCompleted,
    };
  },
);

// 내모임 신청자
export const mockParticipants: Record<number, ParticipationDetail[]> =
  myMeetings.reduce(
    (acc, meeting) => {
      acc[meeting.meetingId] = Array.from(
        { length: meeting.currentParticipants },
        (_, i) => ({
          participationId: meeting.meetingId * 100 + i,
          userId: 1000 + i,
          nickname: faker.person.lastName() + faker.person.firstName(),
          profileImage: faker.image.avatar(),
          status:
            i === 0 && meeting.isHost
              ? "ACCEPTED"
              : i % 5 === 0
                ? "PENDING"
                : "ACCEPTED",
          bio: faker.person.bio(),
          interests: faker.helpers.arrayElements(interestCategories, {
            min: 1,
            max: 3,
          }),
        }),
      );
      return acc;
    },
    {} as Record<number, ParticipationDetail[]>,
  );
