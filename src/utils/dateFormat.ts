/**
 * ISO 날짜 문자열 또는 Date 객체를 "YYYY년 MM월 DD일 (요일)" 형식으로 변환
 * @param dateInput - ISO 형식의 날짜 문자열 또는 Date 객체
 * @returns 포맷된 날짜 문자열 (예: "2026년 02월 12일 (목)")
 */
export function formatScheduleFullDate(dateInput: string | Date): string {
	const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');
	const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
	const weekday = weekdays[date.getDay()];

	return `${year}년 ${month}월 ${day}일 (${weekday})`;
}

/**
 * ISO 날짜 문자열을 "YYYY. M. D(요일) HH:MM" 형식으로 변환
 * @param dateString - ISO 형식의 날짜 문자열
 * @returns 포맷된 날짜 문자열 (예: "2026. 1. 19 (일) 14:30")
 */
export function formatFullDateTime(dateString: string): string {
	const date = new Date(dateString);
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
	const weekday = weekdays[date.getDay()];
	const hours = date.getHours();
	const minutes = date.getMinutes();
	return `${year}. ${month}. ${day} (${weekday}) ${hours}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * ISO 날짜 문자열을 "HH:MM" 형식으로 변환
 * @param dateString - ISO 형식의 날짜 문자열
 * @returns 포맷된 시간 문자열 (예: "14:30")
 */
export function formatTime(dateString: string): string {
	const date = new Date(dateString);
	const hours = date.getHours().toString().padStart(2, '0');
	const minutes = date.getMinutes().toString().padStart(2, '0');

	return `${hours}:${minutes}`;
}

/**
 * ISO 날짜 문자열을 상대 시간(예: "방금 전", "5분 전")으로 변환
 * @param isoString - ISO 형식의 날짜 문자열
 * @returns 상대 시간 문자열
 */
export function formatRelativeTime(isoString: string): string {
	const date = new Date(isoString);
	const now = new Date();
	const diff = now.getTime() - date.getTime();
	const minutes = Math.floor(diff / (1000 * 60));
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (minutes < 1) return '방금 전';
	if (minutes < 60) return `${minutes}분 전`;
	if (hours < 24) return `${hours}시간 전`;
	if (days < 7) return `${days}일 전`;
	return date.toLocaleDateString('ko-KR');
}

/**
 * ISO 날짜 문자열을 "YYYY-MM-DD" 형식으로 변환 (날짜 비교용)
 * @param dateString - ISO 형식의 날짜 문자열
 * @returns "YYYY-MM-DD" 형식의 문자열
 */
export function toYYYYMMDD(dateString: string): string {
	const date = new Date(dateString);
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');

	return `${year}-${month}-${day}`;
}

export function formatDateKeyLocal(date: Date): string {
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');

	return `${year}-${month}-${day}`;
}

/**
 * ISO 날짜 문자열을 "YYYY.MM.DD" 형식으로 변환
 * @param dateString - ISO 형식의 날짜 문자열
 * @returns "YYYY.MM.DD" 형식의 문자열
 */
export function formatDateToYYYYMMDD_DOT(dateString: string): string {
	const date = new Date(dateString);
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');

	return `${year}.${month}.${day}`;
}

/**
 * ISO 날짜 문자열을 "YYYY년 M월 D일 요일" 형식으로 변환 (채팅 구분선 표시용)
 * @param dateString - ISO 형식의 날짜 문자열
 * @returns 포맷된 날짜 문자열 (예: "2026년 1월 19일 월요일")
 */
export function formatDateSeparator(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleDateString('ko-KR', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		weekday: 'long',
	});
}

/**
 * 날짜와 시간(12시간제)을 결합하여 ISO 형식 문자열로 변환
 * @param date - 날짜 객체
 * @param hour - 시간 (1-12)
 * @param minute - 분 (00-59)
 * @param period - AM/PM
 * @returns ISO 형식 문자열 (YYYY-MM-DDTHH:mm:ss)
 */
export function combineDateAndTime(
	date: Date,
	hour: string,
	minute: string,
	period: 'AM' | 'PM',
): string {
	const combinedDateTime = new Date(date);

	// 12시간제를 24시간제로 변환
	let hour24 = parseInt(hour);
	if (period === 'PM' && hour24 !== 12) {
		hour24 += 12;
	} else if (period === 'AM' && hour24 === 12) {
		hour24 = 0;
	}

	combinedDateTime.setHours(hour24);
	combinedDateTime.setMinutes(parseInt(minute));
	// 초는 기존 값 유지 (수정 모드에서 기존 초 정보 보존)
	// 새로 생성하는 경우 Date 객체의 기본값(0)이 사용됨

	// YYYY-MM-DDTHH:mm:ss 형식으로 변환
	const year = combinedDateTime.getFullYear();
	const month = String(combinedDateTime.getMonth() + 1).padStart(2, '0');
	const day = String(combinedDateTime.getDate()).padStart(2, '0');
	const hours = String(combinedDateTime.getHours()).padStart(2, '0');
	const minutes = String(combinedDateTime.getMinutes()).padStart(2, '0');
	const seconds = String(combinedDateTime.getSeconds()).padStart(2, '0');

	return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

/**
 * ISO 날짜 문자열을 12시간제 시간 정보로 파싱
 * @param dateString - ISO 형식의 날짜 문자열
 * @returns 시간, 분, AM/PM 정보
 */
export function parseToTimeComponents(dateString: string): {
	hour: string;
	minute: string;
	period: 'AM' | 'PM';
} {
	const date = new Date(dateString);
	const hour24 = date.getHours();
	const minute = date.getMinutes();

	const period: 'AM' | 'PM' = hour24 >= 12 ? 'PM' : 'AM';
	const hour12 = hour24 % 12 || 12;

	return {
		hour: String(hour12),
		minute: String(minute).padStart(2, '0'),
		period,
	};
}

/**
 * DB에서 반환된 날짜 문자열(예: "YYYY-MM-DD HH:mm:ss")을 파싱하여 포맷팅
 * @param dateString - DB 날짜 문자열 (날것의 데이터도 최대한 수용)
 * @param options - 포맷팅 옵션
 * @param options.type - 'date' | 'time' | 'full' (기본값: 'full')
 * @param options.separator - 구분자 (기본값: date는 ".", time은 ":", full은 '-', ':')
 * @returns 포맷된 문자열 (예: "2024-01-01 13:30:00", "24.01.01" 또는 "13:30")
 */
export function formatDateTime(
	dateString: string,
	options?: {
		type?: 'date' | 'time' | 'full';
		separator?: string;
	},
): string {
	if (!dateString) return '';

	const { type = 'full', separator } = options || {};

	// 숫자가 아닌 문자를 제거하여 순수 숫자만 추출
	const numbers = dateString.replace(/\D/g, '');

	if (type === 'full') {
		if (numbers.length >= 14) {
			return `${numbers.slice(0, 4)}-${numbers.slice(4, 6)}-${numbers.slice(6, 8)} ${numbers.slice(8, 10)}:${numbers.slice(10, 12)}:${numbers.slice(12, 14)}`;
		}
		if (numbers.length >= 12) {
			return `${numbers.slice(0, 4)}-${numbers.slice(4, 6)}-${numbers.slice(6, 8)} ${numbers.slice(8, 10)}:${numbers.slice(10, 12)}`;
		}
		if (numbers.length >= 8) {
			return `${numbers.slice(0, 4)}-${numbers.slice(4, 6)}-${numbers.slice(6, 8)}`;
		}
		return dateString;
	}

	// 구분자 설정 (기본값: 날짜는 '.', 시간은 ':')
	const sep = separator ?? (type === 'date' ? '.' : ':');

	if (type === 'date') {
		// 8자리(YYYYMMDD)인 경우 YY{sep}MM{sep}DD 형식으로 변환
		if (numbers.length >= 8) {
			// 뒤에서부터 8자리를 기준으로 처리하거나 앞에서부터 처리
			// 보통 YYYYMMDD 형식이므로 마지막 8자리를 가져옴 (시각이 포함된 경우 대비)
			const datePart = numbers.slice(0, 8);
			return `${datePart.slice(2, 4)}${sep}${datePart.slice(4, 6)}${sep}${datePart.slice(6, 8)}`;
		}
	} else if (type === 'time') {
		// 시간 부분 추출 (보통 날짜 뒤에 오므로 numbers가 12자리 이상이면 시각은 8번째부터)
		if (numbers.length >= 12) {
			const timePart = numbers.slice(8, 12);
			return `${timePart.slice(0, 2)}${sep}${timePart.slice(2, 4)}`;
		}
		// 4자리만 있는 경우 바로 처리
		if (numbers.length >= 4) {
			return `${numbers.slice(0, 2)}${sep}${numbers.slice(2, 4)}`;
		}
	}

	return dateString;
}

// 기존 코드와의 호환성을 위해 별칭으로도 export
export const formatClassCreateDate = formatFullDateTime;

/**
 * ISO 8601 문자열에서 밀리초·타임존을 제거해 "YYYY-MM-DDTHH:mm:ss" 형태로 반환
 * 백엔드가 타임존 없는 로컬 시간 형식을 요구할 때 사용
 */
export const toLocalISOString = (isoString: string): string => isoString.slice(0, 19);
