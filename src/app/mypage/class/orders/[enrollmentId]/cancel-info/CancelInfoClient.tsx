'use client';

import { useParams, useRouter } from 'next/navigation';

import { CancelClassContent } from '@/pages/mypage/CancelClass';

const CancelInfoClient = () => {
	const params = useParams();
	const router = useRouter();
	const enrollmentId = params.enrollmentId as string;

	return (
		<CancelClassContent
			enrollmentId={enrollmentId}
			onBack={() => router.back()}
			onNavigateToList={() => router.push('/mypage/class/orders')}
		/>
	);
};

export default CancelInfoClient;
