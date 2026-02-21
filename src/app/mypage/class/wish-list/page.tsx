import { createPageMetadata } from '@/utils/metadata';

import WishListClient from './WishListClient';

export const metadata = createPageMetadata({
	title: '찜 목록',
	description: '찜한 클래스 목록 페이지',
	noindex: true,
});

export default function WishListPage() {
	return <WishListClient />;
}
