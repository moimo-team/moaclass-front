// roomId별 NEW_CHAT 발행 가능 여부를 관리하는 메모리 저장소
const canNotifyByRoomId = new Map<number, boolean>();

// 해당 room에서 NEW_CHAT을 지금 발행해도 되는지 확인
export const shouldEmitNewChat = (roomId: number): boolean => {
	return canNotifyByRoomId.get(roomId) !== false;
};

// NEW_CHAT을 발행한 room을 잠금 상태로 변경
export const markNewChatEmitted = (roomId: number): void => {
	canNotifyByRoomId.set(roomId, false);
};

// 알림 읽음 처리 후 해당 room의 NEW_CHAT 발행을 다시 허가
export const resetNewChatByRoom = (roomId: number): void => {
	canNotifyByRoomId.set(roomId, true);
};

// 전체 읽음 등에서 모든 room 잠금 상태를 초기화
export const resetAllNewChatRooms = (): void => {
	canNotifyByRoomId.clear();
};
