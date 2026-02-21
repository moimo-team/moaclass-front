import { createPageMetadata } from '@/utils/metadata';

import ProfileClient from './ProfileClient';

export const metadata = createPageMetadata({
	title: '프로필',
	description: '프로필 관리 페이지',
	noindex: true,
});

export default function ProfilePage() {
	return <ProfileClient />;
}
