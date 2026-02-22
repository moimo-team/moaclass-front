import { createPageMetadata } from '@/utils/metadata';

import CouponsClient from './CouponsClient';

export const metadata = createPageMetadata({
	title: '쿠폰',
	description: '쿠폰 관리 페이지',
	noindex: true,
});

export default function CouponsPage() {
	return <CouponsClient />;
}
