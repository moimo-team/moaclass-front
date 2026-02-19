'use client';

import { useState } from 'react';

import LoginRequiredDialog from '@/components/features/login/LoginRequiredDialog';
import { MoimerIntroContent } from '@/pages/moimer/MoimerIntro';
import { useAuthStore } from '@/store/authStore';

export default function MoimerIntroClient() {
	const { isLoggedIn } = useAuthStore();
	const [showLoginPrompt, setShowLoginPrompt] = useState(false);

	return (
		<>
			<MoimerIntroContent
				isLoggedIn={isLoggedIn}
				onOpenLoginPrompt={() => setShowLoginPrompt(true)}
			/>
			<LoginRequiredDialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt} />
		</>
	);
}
