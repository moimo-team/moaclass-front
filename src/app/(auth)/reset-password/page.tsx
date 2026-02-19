import { Suspense } from 'react';

import LoadingSpinner from '@/components/common/LoadingSpinner';
import { createPageMetadata } from '@/utils/metadata';

import ResetPasswordClient from './ResetPasswordClient';

export const metadata = createPageMetadata({
	title: '비밀번호 재설정',
	description: '비밀번호 재설정 페이지',
	noindex: true,
});

export default function ResetPasswordPage() {
	return (
		<Suspense fallback={<LoadingSpinner />}>
			<ResetPasswordClient />
		</Suspense>
	);
}
