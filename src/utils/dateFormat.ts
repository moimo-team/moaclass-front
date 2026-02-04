/**
 * ISO 날짜 문자열을 "YYYY. M. D(요일) HH:MM" 형식으로 변환
 * @param dateString - ISO 형식의 날짜 문자열
 * @returns 포맷된 날짜 문자열 (예: "2026. 1. 19 (일) 14:30")
 */
export function formatClassCreateDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const weekday = weekdays[date.getDay()];
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${year}. ${month}. ${day} (${weekday}) ${hours}:${minutes
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
  period: "AM" | "PM"
): string {
  const combinedDateTime = new Date(date);
  
  // 12시간제를 24시간제로 변환
  let hour24 = parseInt(hour);
  if (period === "PM" && hour24 !== 12) {
    hour24 += 12;
  } else if (period === "AM" && hour24 === 12) {
    hour24 = 0;
  }
  
  combinedDateTime.setHours(hour24);
  combinedDateTime.setMinutes(parseInt(minute));
  // 초는 기존 값 유지 (수정 모드에서 기존 초 정보 보존)
  // 새로 생성하는 경우 Date 객체의 기본값(0)이 사용됨
  
  // YYYY-MM-DDTHH:mm:ss 형식으로 변환
  const year = combinedDateTime.getFullYear();
  const month = String(combinedDateTime.getMonth() + 1).padStart(2, "0");
  const day = String(combinedDateTime.getDate()).padStart(2, "0");
  const hours = String(combinedDateTime.getHours()).padStart(2, "0");
  const minutes = String(combinedDateTime.getMinutes()).padStart(2, "0");
  const seconds = String(combinedDateTime.getSeconds()).padStart(2, "0");
  
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
  period: "AM" | "PM";
} {
  const date = new Date(dateString);
  const hour24 = date.getHours();
  const minute = date.getMinutes();
  
  const period: "AM" | "PM" = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 || 12;
  
  return {
    hour: String(hour12),
    minute: String(minute).padStart(2, "0"),
    period,
  };
}

