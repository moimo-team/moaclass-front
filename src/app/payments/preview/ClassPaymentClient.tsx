'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { ClassPaymentContent } from '@/pages/pay/ClassPayment';

export default function ClassPaymentClient() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const scheduleId = Number(searchParams.get('scheduleId') || '1');
	const quantity = Number(searchParams.get('quantity') || '1');

	if (!scheduleId) {
		return <div>잘못된 접근입니다. 스케줄 정보가 없습니다.</div>;
	}

	return (
		<ClassPaymentContent
			scheduleId={scheduleId}
			quantity={quantity}
			onBack={() => router.back()}
		/>
	);
}
