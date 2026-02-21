import { createPageMetadata } from '@/utils/metadata';

import CancelInfoClient from './CancelInfoClient';

export const metadata = createPageMetadata({
	title: '취소 상세',
	description: '주문 취소 상세 페이지',
	noindex: true,
});

export default function CancelInfoPage() {
	return <CancelInfoClient />;
}
