import { redirect } from 'next/navigation';

import { createPageMetadata } from '@/utils/metadata';

export const metadata = createPageMetadata({
	title: '마이페이지',
	description: '마이페이지',
	noindex: true,
});

export default function Page() {
	redirect('/mypage/profile');
}
