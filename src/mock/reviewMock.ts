import defaultMeetingImage from '@/assets/images/moimo-meetings.png';
import type { Meeting } from '@/models/meeting.model';
import type { MyReviewItem } from '@/models/review.model';

// Review 인터페이스 정의 (Moimo용)
export interface MeetingReview {
	reviewId: string | number;
	title: string;
	content: string;
	rating: number;
	reviewerName: string;
	createdAt: string;
	meeting: Meeting;
	imageUrl?: string[];
}

// Mock Meeting 데이터
const mockMeetings: Meeting[] = [
	{
		meetingId: 1,
		title: '모임 1',
		meetingImage: 'https://via.placeholder.com/150',
		interestId: 1,
		interestName: '인간관계(친목)',
		maxParticipants: 10,
		currentParticipants: 5,
		address: '서울시 강남구',
		meetingDate: '2024-03-01T10:00:00',
	},
	{
		meetingId: 2,
		title: '모임 2',
		meetingImage: 'https://via.placeholder.com/150',
		interestId: 2,
		interestName: '술',
		maxParticipants: 8,
		currentParticipants: 3,
		address: '서울시 종로구',
		meetingDate: '2024-03-05T14:00:00',
	},
];

// Mock Review 데이터
export const mockReviews: MeetingReview[] = [
	{
		reviewId: 101,
		title: '정말 즐거웠던 모임!',
		content:
			'모임 분위기가 너무 좋았고, 새로운 사람들과 즐거운 시간을 보낼 수 있었습니다. 다음에도 꼭 참여하고 싶어요. 강추합니다!',
		rating: 5,
		reviewerName: '김모이',
		createdAt: '2024-02-28',
		meeting: mockMeetings[0],
		imageUrl: [defaultMeetingImage],
	},
	{
		reviewId: 102,
		title: '새로운 경험이었어요',
		content:
			'평소 관심 있던 분야인데, 전문가분께 많은 걸 배울 수 있어서 좋았습니다. 시간 가는 줄 몰랐네요.',
		rating: 4,
		reviewerName: '박클래스',
		createdAt: '2024-02-27',
		meeting: mockMeetings[1],
		imageUrl: [defaultMeetingImage],
	},
	{
		reviewId: 103,
		title: '친구들과 즐거운 시간',
		content:
			'친구들과 함께 참여했는데, 다들 만족도가 높았어요. 다음에 다른 모임도 참여해볼 예정입니다.',
		rating: 5,
		reviewerName: '이친구',
		createdAt: '2024-02-26',
		meeting: mockMeetings[0],
		imageUrl: [defaultMeetingImage],
	},
	{
		reviewId: 104,
		title: '기대했던 만큼 좋았습니다',
		content:
			'별 기대 없이 갔는데, 예상외로 너무 좋았습니다. 진행자분도 친절하시고, 내용도 알찼습니다. 만족합니다.',
		rating: 4,
		reviewerName: '최만족',
		createdAt: '2025-02-25',
		meeting: mockMeetings[1],
		imageUrl: [defaultMeetingImage],
	},
	{
		reviewId: 105,
		title: '잔짜 별로였어요',
		content: `별 기대 없이 갔는데, 기대보다 더 별로였어요. 두쫀쿠 하나 준대서 갔는데 안에 소면이 들어가 있었어요!!!

두쫀쿠가 뭐냐고요?

'두쫀쿠'는 말씀하신 대로 **'두바이 쫀득 쿠키'**의 줄임말입니다.
최근 SNS와 디저트 시장을 휩쓸었던 '두바이 초콜릿'의 열풍이 쿠키 버전으로 진화한 형태라고 보시면 됩니다. 일반적인 쿠키와는 확실히 차별화된 매력을 가지고 있어요.
🍪 두쫀쿠의 핵심 포인트
카다이프(Kadaif)의 식감: 두바이 초콜릿의 정체성인 튀긴 면 '카다이프'가 쿠키 속에 들어갑니다. 덕분에 씹을 때마다 **'바삭바삭'**한 소리가 나는 것이 특징입니다.
피스타치오 스프레드: 고소하고 진한 피스타치오 페이스트가 듬뿍 들어가 특유의 초록빛과 풍미를 냅니다.
꾸덕하고 쫀득한 반죽: 쿠키 베이스 자체가 브라우니처럼 묵직하고 쫀득(쫀쫀)해서, 안의 바삭한 카다이프와 대비되는 **'겉쫀속바'**의 식감을 완성합니다.
💡 왜 이렇게 인기일까?
단순히 달기만 한 게 아니라 **고소함(피스타치오) + 달콤함(초콜릿) + 독특한 식감(카다이프)**이 한데 어우러져 '도파민 터지는 맛'이라는 평을 듣기도 합니다.`,
		rating: 1,
		reviewerName: '김두바이쫀득쿠키',
		createdAt: '2026-02-01',
		meeting: mockMeetings[1],
		imageUrl: [defaultMeetingImage, defaultMeetingImage, defaultMeetingImage],
	},
];

export const mockMyReview: MyReviewItem = {
	id: 12,
	lessonId: 3,
	lessonTitle: '레슨타이틀',
	rating: 4.5,
	content: '좋은 수업이었어요.',
	image1: 'https://picsum.photos/id/64/300/300',
	image2: 'https://picsum.photos/id/65/300/300',
	image3: null,
	image4: null,
	image5: null,
	image6: null,
	image7: null,
	image8: null,
};
