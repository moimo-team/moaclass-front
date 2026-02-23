import { useEffect, useState } from 'react';

interface UseKakaoMapReturn {
	isLoaded: boolean;
	error: string | null;
}

export function useKakaoMap(): UseKakaoMapReturn {
	const [isLoaded, setIsLoaded] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const initialize = () => {
			window.kakao.maps.load(() => {
				setIsLoaded(true);
			});
		};

		// 1. 이미 load()가 실행 가능한 상태인 경우 즉시 초기화
		if (window.kakao && window.kakao.maps && window.kakao.maps.load) {
			initialize();
			return;
		}

		// 2. SDK 스크립트 자체가 로드되길 대기 (최대 5초)
		const checkInterval = setInterval(() => {
			if (window.kakao && window.kakao.maps && window.kakao.maps.load) {
				initialize();
				clearInterval(checkInterval);
			}
		}, 100);

		const timeout = setTimeout(() => {
			if (!window.kakao?.maps?.load) {
				setError('카카오맵 API를 불러올 수 없습니다');
				clearInterval(checkInterval);
			}
		}, 5000);

		return () => {
			clearInterval(checkInterval);
			clearTimeout(timeout);
		};
	}, []);

	return { isLoaded, error };
}

export function isKakaoMapLoaded(): boolean {
	return !!(window.kakao && window.kakao.maps && window.kakao.maps.services);
}
