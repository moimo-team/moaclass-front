/**
 * 환경 변수 접근 유틸리티
 * Vite(import.meta.env)와 Next.js(process.env) 환경 모두를 지원합니다.
 */

const nextPublicEnv: Record<string, string | undefined> = {
	NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
	NEXT_PUBLIC_ENABLE_MOCK: process.env.NEXT_PUBLIC_ENABLE_MOCK,
	NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
	NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
	NEXT_PUBLIC_KAKAO_CLIENT_ID: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID,
	NEXT_PUBLIC_KAKAO_REDIRECT_URI: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI,
	NEXT_PUBLIC_KAKAO_API_KEY: process.env.NEXT_PUBLIC_KAKAO_API_KEY,
};

const getEnv = (key: string, defaultValue: string = ''): string => {
	// 1. Next.js 환경 변수 우선 확인 (정적 맵 사용)
	const nextKey = key.startsWith('VITE_')
		? key.replace('VITE_', 'NEXT_PUBLIC_')
		: `NEXT_PUBLIC_${key}`;

	if (nextPublicEnv[nextKey]) return (nextPublicEnv[nextKey] as string).trim();
	if (typeof process !== 'undefined' && process.env && process.env[key]) {
		return (process.env[key] as string).trim();
	}

	// 2. Vite 환경 변수 확인 (에러 방지를 위해 try-catch 및 타입 캐스팅 사용)
	try {
		// Next.js 빌드 타임에 import.meta 참조 에러가 날 수 있으므로 체크

		// @ts-expect-error - import.meta.env may not exist in non-Vite environments
		const viteEnv = import.meta.env;
		if (viteEnv) {
			return ((viteEnv[key] || viteEnv[`VITE_${key}`] || defaultValue) as string).trim();
		}
	} catch (e) {
		// Next.js 환경 등에서는 import.meta.env 접근 시 에러가 날 수 있음
	}

	return defaultValue;
};

// 개발 환경 확인 함수
const isDevelopment = (): boolean => {
	// Next.js 환경
	if (typeof process !== 'undefined' && process.env.NODE_ENV) {
		return process.env.NODE_ENV === 'development';
	}

	// Vite 환경
	try {
		// @ts-expect-error - import.meta.env may not exist in non-Vite environments
		return import.meta.env.MODE === 'development';
	} catch {
		return false;
	}
};

/**
 * Next.js 환경 변수를 가져오는 유틸리티 (클라이언트 사이드 호환)
 */
export function getNextPublicEnv(key: string, defaultValue: string = ''): string {
	try {
		return (nextPublicEnv[key] as string) || defaultValue;
	} catch {
		return defaultValue;
	}
}

export const ENV = {
	API_URL: getEnv('VITE_API_URL', '/api'),
	SOCKET_URL: getEnv('VITE_SOCKET_URL', 'https://moaclass-back.onrender.com'),
	ENABLE_MOCK: (() => {
		const raw = getEnv('VITE_ENABLE_MOCK', 'true');
		const value = raw.split('#')[0].trim();
		return value === 'true';
	})(),
	GOOGLE_CLIENT_ID: getEnv('VITE_GOOGLE_CLIENT_ID'),
	KAKAO_CLIENT_ID: getEnv('VITE_KAKAO_CLIENT_ID'),
	KAKAO_REDIRECT_URI: getEnv('VITE_KAKAO_REDIRECT_URI'),
	KAKAO_API_KEY: getEnv('VITE_KAKAO_API_KEY'),
	IS_DEV: isDevelopment(),
};
