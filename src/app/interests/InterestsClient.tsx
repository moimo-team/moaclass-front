'use client';

import { useRouter } from 'next/navigation';

import { InterestsContent } from '@/pages/interests/Interests';

export default function InterestsClient() {
	const router = useRouter();

	return (
		<InterestsContent
			onBack={() => router.back()}
			onTopicClick={(id) => router.push(`/meetings?interestFilter=${id}`)}
		/>
	);
}
