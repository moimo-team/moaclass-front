import { createPageMetadata } from '@/utils/metadata';

import PointsClient from './PointsClient';

export const metadata = createPageMetadata({
	title: '포인트',
	description: '포인트 내역 페이지',
	noindex: true,
});

export default function PointsPage() {
	return <PointsClient />;
}
