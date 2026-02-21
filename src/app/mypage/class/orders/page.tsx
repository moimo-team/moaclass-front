import { createPageMetadata } from '@/utils/metadata';

import OrderListClient from './OrderListClient';

export const metadata = createPageMetadata({
	title: '주문 내역',
	description: '클래스 주문 내역 페이지',
	noindex: true,
});

export default function OrderListPage() {
	return <OrderListClient />;
}
