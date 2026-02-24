import { VIRTUAL_PROFIT_TRANSACTION_ID } from '@/constants/point';
import type { PointHistory } from '@/models/point.model';

/**
 * 포인트 내역의 설명을 생성하는 헬퍼 함수
 */
export const getPointHistoryDescription = (item: PointHistory): string | null => {
	switch (item.type) {
		case 'CHARGE':
			return item.transactionId === VIRTUAL_PROFIT_TRANSACTION_ID
				? '모멘토 수익내역'
				: '포인트 충전';
		case 'EVENT':
			return '이벤트';
		case 'REFUND':
			return `[환불] ${item.lessonName || ''}`;
		default:
			return item.lessonName;
	}
};
