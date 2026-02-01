/**
 * ISO 날짜 문자열을 "YYYY. M. D(요일) HH:MM" 형식으로 변환
 * @param dateString - ISO 형식의 날짜 문자열
 * @returns 포맷된 날짜 문자열 (예: "2026. 1. 19(일) 14:30")
 */
export function formatMeetingDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const weekday = weekdays[date.getDay()];
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${year}. ${month}. ${day}(${weekday}) ${hours}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

/**
 * ISO 날짜 문자열을 "HH:MM" 형식으로 변환
 * @param dateString - ISO 형식의 날짜 문자열
 * @returns 포맷된 시간 문자열 (예: "14:30")
 */
export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

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

  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;
  return date.toLocaleDateString("ko-KR");
}

/**
 * ISO 날짜 문자열을 "YYYY-MM-DD" 형식으로 변환 (날짜 비교용)
 * @param dateString - ISO 형식의 날짜 문자열
 * @returns "YYYY-MM-DD" 형식의 문자열
 */
export function toYYYYMMDD(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * ISO 날짜 문자열을 "YYYY년 M월 D일 요일" 형식으로 변환 (채팅 구분선 표시용)
 * @param dateString - ISO 형식의 날짜 문자열
 * @returns 포맷된 날짜 문자열 (예: "2026년 1월 19일 월요일")
 */
export function formatDateSeparator(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
}
