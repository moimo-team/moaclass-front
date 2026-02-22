import { createPageMetadata } from '@/utils/metadata';

import JoinClient from './JoinClient';

export const metadata = createPageMetadata({
	title: '회원가입',
	description: '회원가입 페이지',
	noindex: true,
});

export default function JoinPage() {
	return <JoinClient />;
}
