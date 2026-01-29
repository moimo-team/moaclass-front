// 메세지 전송자 정보
export interface MessageSender {
  id: number;
  nickname: string;
  image: string;
}

// 채팅 메세지 타입
export interface ChatMessage {
  id: number;
  content: string;
  senderId: number;
  meetingId: number;
  createdAt: string;
  sender: MessageSender;
}

// 메세지 목록 조회 API 응답
export interface ChatMessageResponse {
  meetingId: number;
  messages: ChatMessage[];
}

// 채팅방 목록 조회 API 응답
export interface ChatRoom {
  meetingId: number;
  title: string;
  image: string | null;
  memberCount: number;
  isLeader: boolean;
  hostId: number;
  lastMessage?: {
    sender: string;
    content: string;
    createdAt: string;
  };
}
