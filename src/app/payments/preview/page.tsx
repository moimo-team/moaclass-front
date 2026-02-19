import ClassPaymentClient from '@/app/payments/preview/ClassPaymentClient';
import ProtectedRouteNext from '@/components/common/next/ProtectedRouteNext';

import type { Metadata } from 'next';

/**
 * SEO 담당자 전용: 메타데이터 설정 위치
 * 결제 페이지이므로 인덱싱 차단(noindex) 설정을 권장합니다.
 */
export const metadata: Metadata = {
	title: '클래스 결제 | 모아클',
	robots: { index: false, follow: false },
};

export default function Page() {
	return (
		<ProtectedRouteNext>
			<ClassPaymentClient />
		</ProtectedRouteNext>
	);
}
