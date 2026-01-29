import type { ChatMessage } from "@/models/chat.model";
import { mockChatMessages, mockChatRooms } from "./chatMock";

// Custom minimal EventEmitter to avoid Node.js 'events' module dependency in browser
class CustomEventEmitter {
  private events: Record<string, Function[]> = {};

  on(eventName: string, listener: Function): this {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(listener);
    return this;
  }

  emit(eventName: string, ...args: any[]): boolean {
    if (this.events[eventName]) {
      this.events[eventName].forEach((listener) => listener(...args));
      return true;
    }
    return false;
  }

  off(eventName: string, listener: Function): this {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter(
        (l) => l !== listener,
      );
    }
    return this;
  }
}

class MockSocket extends CustomEventEmitter {
  public id: string; // id 속성 추가
  private meetingId: number | null = null;
  private userId: number = 46; // Mock user ID '나'
  private nickname: string = "나";
  private profileImage: string = "https://i.pravatar.cc/150?img=46"; // Mock user profile image

  constructor() {
    super();
    // 랜덤한 Mock ID 생성
    this.id = `mock_socket_${Math.random().toString(36).substr(2, 9)}`;
  }

  // 'joinRoom' 이벤트를 받으면, 방에 참여했다는 시스템 메시지를 생성
  joinRoom(meetingId: number, callback?: (res: any) => void) {
    // callback 추가
    this.meetingId = meetingId;
    const joinMessage: ChatMessage = {
      id: Date.now(),
      meetingId: meetingId,
      senderId: 0, // 시스템 메시지 senderId는 0
      content: `${this.nickname}님이 입장했습니다.`,
      createdAt: new Date().toISOString(),
      sender: { id: 0, nickname: "System", image: "" },
    };

    // 해당 채팅방의 메시지 목록에 시스템 메시지 추가
    if (mockChatMessages[meetingId]) {
      mockChatMessages[meetingId].push(joinMessage);
    } else {
      mockChatMessages[meetingId] = [joinMessage];
    }

    // 채팅방 멤버 수 증가
    const room = mockChatRooms.find((r) => r.meetingId === meetingId);
    if (room) {
      room.memberCount++;
    }

    // 클라이언트에게 'newMessage' 이벤트를 보내 시스템 메시지 즉시 표시
    this.emit("newMessage", joinMessage);

    // 콜백 실행
    if (callback) {
      callback({ status: "joined", meetingId });
    }
  }

  // getMessages 처리 메서드
  getMessages(meetingId: number, callback?: (res: any) => void) {
    const messages = mockChatMessages[meetingId] || [];
    if (callback) {
      callback({ meetingId, messages });
    }
  }

  // 'sendMessage' 이벤트를 받으면, 새 메시지를 생성하고 모두에게 전파
  sendMessage(
    payload: {
      meetingId: number;
      senderId: number;
      content: string;
    },
    callback?: (res: any) => void,
  ) {
    // callback 추가
    if (!this.meetingId) return;

    const newMessage: ChatMessage = {
      id: Date.now(),
      meetingId: payload.meetingId,
      senderId: this.userId,
      content: payload.content,
      createdAt: new Date().toISOString(),
      sender: {
        id: this.userId,
        nickname: this.nickname,
        image: this.profileImage,
      },
    };

    // 해당 채팅방 메시지 목록에 새 메시지 추가
    if (!mockChatMessages[this.meetingId]) {
      mockChatMessages[this.meetingId] = [];
    }
    mockChatMessages[this.meetingId].push(newMessage);

    // 해당 채팅방의 마지막 메시지 정보 업데이트
    const room = mockChatRooms.find((r) => r.meetingId === this.meetingId);
    if (room) {
      room.lastMessage = {
        sender: this.nickname,
        content: newMessage.content,
        createdAt: newMessage.createdAt,
      };
    }

    // 클라이언트에게 'newMessage' 이벤트를 전송
    this.emit("newMessage", newMessage);

    // 콜백 실행
    if (callback) {
      callback({ status: "sent", messageId: newMessage.id });
    }
  }

  // 연결 해제 시, 퇴장 메시지 생성
  disconnect() {
    if (!this.meetingId) return;

    const leaveMessage: ChatMessage = {
      id: Date.now(),
      meetingId: this.meetingId,
      senderId: 0,
      content: `${this.nickname}님이 퇴장했습니다.`,
      createdAt: new Date().toISOString(),
      sender: { id: 0, nickname: "System", image: "" },
    };

    // 메시지가 없을 경우 대비
    if (mockChatMessages[this.meetingId]) {
      mockChatMessages[this.meetingId].push(leaveMessage);
    }

    // 멤버 수 감소
    const room = mockChatRooms.find((r) => r.meetingId === this.meetingId);
    if (room) {
      room.memberCount--;
    }

    this.emit("newMessage", leaveMessage);
    this.meetingId = null; // 방 정보 초기화
    console.log("Mock Socket disconnected");
  }

  // EventEmitter의 emit을 오버라이드하여, 서버 -> 클라이언트 이벤트만 처리
  emit(event: string, ...args: any[]): boolean {
    return super.emit(event, ...args);
  }

  // 클라이언트 -> 서버 이벤트를 처리하는 메서드
  handleClientEmit(event: string, ...args: any[]) {
    console.log(`Mock Socket received client event: ${event}`, args);
    // args[0]: 데이터, args[1]: 콜백 함수 (있을 경우)
    const data = args[0];
    const callback =
      typeof args[args.length - 1] === "function"
        ? args[args.length - 1]
        : undefined;

    switch (event) {
      case "joinRoom":
        this.joinRoom(data, callback);
        break;
      case "sendMessage":
        this.sendMessage(data, callback);
        break;
      case "getMessages": // getMessages 핸들링
        this.getMessages(data, callback);
        break;
    }
  }

  // 모킹용 메서드: 강제로 연결 이벤트를 발생시킴
  simulateConnection() {
    setTimeout(() => {
      this.emit("connect");
    }, 100);
  }
}

// Mock Socket 인스턴스를 생성하고 반환하는 팩토리 함수
export const createMockSocket = () => {
  const mockSocket = new MockSocket();

  // 생성되자마자 연결된 척 이벤트 발생
  mockSocket.simulateConnection();

  // 실제 socket.io 클라이언트와 유사한 인터페이스를 갖도록 반환
  return {
    id: mockSocket.id, // id 속성 노출
    on: mockSocket.on.bind(mockSocket),
    emit: mockSocket.handleClientEmit.bind(mockSocket),
    disconnect: mockSocket.disconnect.bind(mockSocket),
    connected: true, // connected 속성
  };
};
