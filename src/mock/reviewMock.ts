import type { Meeting } from "@/models/meeting.model";

// Review 인터페이스 정의
// TODO: Review 타입 정해지면 Model에 정의
export interface Review {
  reviewId: string | number;
  title: string;
  content: string;
  rating: number;
  reviewerName: string;
  createdAt: string;
  meeting: Meeting;
  imageUrl?: string;
}

// Mock Meeting 데이터
const mockMeetings: Meeting[] = [
  {
    meetingId: 1,
    title: "모임 1",
    meetingImage: "https://via.placeholder.com/150",
    interestId: 1,
    interestName: "인간관계(친목)",
    maxParticipants: 10,
    currentParticipants: 5,
    address: "서울시 강남구",
    meetingDate: "2024-03-01T10:00:00",
  },
  {
    meetingId: 2,
    title: "모임 2",
    meetingImage: "https://via.placeholder.com/150",
    interestId: 2,
    interestName: "술",
    maxParticipants: 8,
    currentParticipants: 3,
    address: "서울시 종로구",
    meetingDate: "2024-03-05T14:00:00",
  },
];

// Mock Review 데이터
export const mockReviews: Review[] = [
  {
    reviewId: 101,
    title: "정말 즐거웠던 모임!",
    content:
      "모임 분위기가 너무 좋았고, 새로운 사람들과 즐거운 시간을 보낼 수 있었습니다. 다음에도 꼭 참여하고 싶어요. 강추합니다!",
    rating: 5,
    reviewerName: "김모이",
    createdAt: "2024-02-28",
    meeting: mockMeetings[0],
    imageUrl: "https://via.placeholder.com/150",
  },
  {
    reviewId: 102,
    title: "새로운 경험이었어요",
    content:
      "평소 관심 있던 분야인데, 전문가분께 많은 걸 배울 수 있어서 좋았습니다. 시간 가는 줄 몰랐네요.",
    rating: 4,
    reviewerName: "박클래스",
    createdAt: "2024-02-27",
    meeting: mockMeetings[1],
    imageUrl: "https://via.placeholder.com/150",
  },
  {
    reviewId: 103,
    title: "친구들과 즐거운 시간",
    content:
      "친구들과 함께 참여했는데, 다들 만족도가 높았어요. 다음에 다른 모임도 참여해볼 예정입니다.",
    rating: 5,
    reviewerName: "이친구",
    createdAt: "2024-02-26",
    meeting: mockMeetings[0],
    imageUrl: "https://via.placeholder.com/150",
  },
  {
    reviewId: 104,
    title: "기대했던 만큼 좋았습니다",
    content:
      "별 기대 없이 갔는데, 예상외로 너무 좋았습니다. 진행자분도 친절하시고, 내용도 알찼습니다. 만족합니다.",
    rating: 4,
    reviewerName: "최만족",
    createdAt: "2024-02-25",
    meeting: mockMeetings[1],
    imageUrl: "https://via.placeholder.com/150",
  },
];
