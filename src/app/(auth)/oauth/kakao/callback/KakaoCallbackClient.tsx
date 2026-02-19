'use client';

import { useEffect } from 'react';

export default function KakaoCallbackClient() {
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
