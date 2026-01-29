import { useEffect, useState } from "react";

interface UseKakaoMapReturn {
  isLoaded: boolean;
  error: string | null;
}

export function useKakaoMap(): UseKakaoMapReturn {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 이미 로드되어 있는지 확인
    if (window.kakao && window.kakao.maps) {
      setIsLoaded(true);
      return;
    }

    // 로드 대기 (최대 5초)
    const checkInterval = setInterval(() => {
      if (window.kakao && window.kakao.maps) {
        setIsLoaded(true);
        clearInterval(checkInterval);
      }
    }, 100);

    const timeout = setTimeout(() => {
      if (!window.kakao || !window.kakao.maps) {
        setError("카카오맵 API를 불러올 수 없습니다");
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
  return !!(window.kakao && window.kakao.maps);
}
