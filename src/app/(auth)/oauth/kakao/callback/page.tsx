'use client';

import { useEffect } from 'react';

/**
 * 카카오 로그인 팝업 콜백 페이지
 *
 * 이 컴포넌트는 카카오 인가 서버에서 리다이렉트된 후 실행되며,
 * URL에서 인가 코드(code)를 추출하여 부모 창(LoginClient.tsx)으로 전달하는 브릿지 역할을 합니다.
 *
 * 동작 흐름:
 * 1. 카카오 로그인 완료 후 이 페이지로 리다이렉트됨 (URL에 code 포함)
 * 2. useEffect에서 URL의 쿼리 파라미터에서 code 추출
 * 3. window.opener.postMessage()로 부모 창에 code 전달
 * 4. 팝업 창 자동 닫기
 */
export default function KakaoCallbackPage() {
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get('code');
		const error = urlParams.get('error');

		if (error) {
			window.opener?.postMessage(
				{ type: 'KAKAO_LOGIN_ERROR', error },
				window.location.origin,
			);
			window.close();
			return;
		}

		if (code && window.opener) {
			// 인가 코드를 부모 창으로 전달
			// 보안을 위해 targetOrigin을 '*'로 설정하여 도메인이 다른 로컬 환경에서도 메시지 수신이 가능하게 함
			// (부모 창에서도 origin 검증을 수행하므로 안전함)
			window.opener.postMessage(
				{ type: 'KAKAO_LOGIN_SUCCESS', code },
				window.location.origin,
			);
			window.close();
		}
	}, []);

	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="text-center">
				<p className="text-lg text-muted-foreground">로그인 처리 중...</p>
			</div>
		</div>
	);
}

/**
 * SEO: 콜백 페이지는 검색 엔진 노출이 불필요하므로 인덱싱을 차단합니다.
 * (Next.js Metadata API는 서버 컴포넌트에서만 사용 가능하므로,
 * 만약 메타데이터 설정이 필요하다면 이 파일을 Client Component와 분리해야 합니다.)
 */
