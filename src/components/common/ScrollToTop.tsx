'use client';

import { useEffect } from 'react';

import { usePathname } from 'next/navigation';

/**
 * 페이지 이동 시 스크롤 위치를 최상단으로 초기화하는 컴포넌트
 * - Next.js App Router의 라우트 변경을 감지하여 작동
 */
export default function ScrollToTop() {
	const pathname = usePathname();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	return null;
}
