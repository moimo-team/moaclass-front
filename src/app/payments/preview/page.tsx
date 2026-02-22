import { Suspense } from 'react';

import ClassPaymentClient from '@/app/payments/preview/ClassPaymentClient';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ProtectedRouteNext from '@/components/common/next/ProtectedRouteNext';
import { createPageMetadata } from '@/utils/metadata';

export const metadata = createPageMetadata({
	title: '클래스 결제',
	description: '결제 진행 페이지',
	noindex: true,
});

export default function Page() {
	return (
		<ProtectedRouteNext>
			<Suspense fallback={<LoadingSpinner />}>
				<ClassPaymentClient />
			</Suspense>
		</ProtectedRouteNext>
	);
}
