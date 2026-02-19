import { createPageMetadata } from '@/utils/metadata';

import FindPasswordClient from './FindPasswordClient';

export const metadata = createPageMetadata({
	title: '비밀번호 찾기',
	description: '비밀번호 찾기 페이지',
	noindex: true,
});

export default function FindPasswordPage() {
	return <FindPasswordClient />;
}
