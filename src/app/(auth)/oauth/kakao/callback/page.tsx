import { createPageMetadata } from '@/utils/metadata';

import KakaoCallbackClient from './KakaoCallbackClient';

export const metadata = createPageMetadata({
	title: '카카오 로그인 콜백',
	description: '카카오 로그인 콜백 페이지',
	noindex: true,
});

export default function KakaoCallbackPage() {
	return <KakaoCallbackClient />;
}
