import { fakerKO as faker } from "@faker-js/faker";
import type { ChatMessage, ChatRoom } from "@/models/chat.model";
import type { User } from "@/models/user.model";

// Mock Users
const mockUser1: Pick<User, "id" | "email" | "nickname" | "profileImage"> = {
  id: 1,
  email: "user1@example.com",
  nickname: "첫번째유저",
  profileImage: "https://i.pravatar.cc/150?img=1",
};

const mockUser2: Pick<User, "id" | "email" | "nickname" | "profileImage"> = {
  id: 2,
  email: "user2@example.com",
  nickname: "두번째유저",
  profileImage: "https://i.pravatar.cc/150?img=2",
};

const mockUser3: Pick<User, "id" | "email" | "nickname" | "profileImage"> = {
  id: 3,
  email: "user3@example.com",
  nickname: "세번째유저",
  profileImage: "https://i.pravatar.cc/150?img=3",
};

export const mockUsers = [mockUser1, mockUser2, mockUser3];

// Function to generate a number of chat messages for a given chat room
const generateChatMessages = (
  chatRoomId: number,
  count: number,
): ChatMessage[] => {
  const messages: ChatMessage[] = [];
  for (let i = 0; i < count; i++) {
    const sender = mockUsers[i % mockUsers.length];
    const createdAt = new Date(
      Date.now() - (count - i) * 60 * 1000,
    ).toISOString(); // messages from oldest to newest
    messages.push({
      id: i + 1,
      content: `[방 ${chatRoomId}] ${sender.nickname}의 ${i + 1}번째 메시지`,
      senderId: sender.id,
      meetingId: chatRoomId,
      createdAt: createdAt,
      sender: {
        id: sender.id,
        nickname: sender.nickname,
        image: sender.profileImage || "",
      },
    });
  }
  return messages;
};

// Mock ChatMessages for each room
export const mockChatMessages: Record<number, ChatMessage[]> = {
  1: generateChatMessages(1, 15),
  2: generateChatMessages(2, 10),
  3: generateChatMessages(3, 5),
  4: generateChatMessages(4, 7),
  5: generateChatMessages(5, 3),
  6: generateChatMessages(6, 12),
  7: generateChatMessages(7, 8),
  8: generateChatMessages(8, 6),
  9: generateChatMessages(9, 9),
  10: generateChatMessages(10, 4),
};

// Mock ChatRooms (10개) - derived from mockChatMessages
export const mockChatRooms: ChatRoom[] = Object.keys(mockChatMessages).map(
  (key, i) => {
    const roomId = parseInt(key, 10);
    const messages = mockChatMessages[roomId];
    const lastMessageFromMock = messages[messages.length - 1];

    return {
      meetingId: roomId,
      title: `채팅방 ${roomId}`,
      memberCount: faker.number.int({ min: 2, max: 10 }),
      image: faker.image.urlLoremFlickr({ category: "nature" }),
      lastMessage: {
        sender: lastMessageFromMock.sender.nickname,
        content: lastMessageFromMock.content,
        createdAt: lastMessageFromMock.createdAt,
      },
      hostId: mockUsers[0].id,
      isLeader: i % 2 === 0,
    };
  },
);
