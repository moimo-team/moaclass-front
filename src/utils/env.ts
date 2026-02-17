/**
 * 환경 변수 접근 유틸리티
 * Vite(import.meta.env)와 Next.js(process.env) 환경 모두를 지원합니다.
 */

const getEnv = (key: string, defaultValue: string = ''): string => {
	// 1. Next.js 환경 변수 우선 확인 (NEXT_PUBLIC_ 접두사 자동 처리)
	if (typeof process !== 'undefined' && process.env) {
		const nextKey = key.startsWith('VITE_')
			? key.replace('VITE_', 'NEXT_PUBLIC_')
			: `NEXT_PUBLIC_${key}`;
		if (process.env[nextKey]) return process.env[nextKey] as string;
		if (process.env[key]) return process.env[key] as string;
	}

	// 2. Vite 환경 변수 확인 (에러 방지를 위해 try-catch 및 타입 캐스팅 사용)
	try {
		// Next.js 빌드 타임에 import.meta 참조 에러가 날 수 있으므로 체크
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const viteEnv = import.meta.env;
		if (viteEnv) {
			return (viteEnv[key] || viteEnv[`VITE_${key}`] || defaultValue) as string;
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
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		return import.meta.env.MODE === 'development';
	} catch (e) {
		return false;
	}
};

export const ENV = {
	API_URL: getEnv('VITE_API_URL', 'https://moimo-back.vercel.app'),
	SOCKET_URL: getEnv('VITE_SOCKET_URL', 'https://moimo-back.onrender.com'),
	ENABLE_MOCK: getEnv('VITE_ENABLE_MOCK', 'true') === 'true',
	GOOGLE_CLIENT_ID: getEnv('VITE_GOOGLE_CLIENT_ID'),
	KAKAO_CLIENT_ID: getEnv('VITE_KAKAO_CLIENT_ID'),
	KAKAO_REDIRECT_URI: getEnv('VITE_KAKAO_REDIRECT_URI'),
	KAKAO_API_KEY: getEnv('VITE_KAKAO_API_KEY'),
	IS_DEV: isDevelopment(),
};
