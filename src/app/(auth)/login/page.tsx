import { createPageMetadata } from '@/utils/metadata';

import LoginClient from './LoginClient';

export const metadata = createPageMetadata({
	title: '로그인',
	description: '로그인 페이지',
	noindex: true,
});

export default function LoginPage() {
	return <LoginClient />;
}
