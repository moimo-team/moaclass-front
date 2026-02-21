import { createPageMetadata } from '@/utils/metadata';

import UserInfoClient from './UserInfoClient';

export const metadata = createPageMetadata({
	title: '사용자 정보 입력',
	description: '사용자 정보 입력 페이지',
	noindex: true,
});

export default function UserInfoPage() {
	return <UserInfoClient />;
}
