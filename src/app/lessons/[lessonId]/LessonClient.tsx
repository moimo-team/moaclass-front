'use client';

import { useRouter } from 'next/navigation';

import { LoginRequiredDialogContent } from '@/components/features/login/LoginRequiredDialog';
import { useLessonApplicationConfirmationNext } from '@/hooks/useLessonApplicationConfirmationNext';
import { LessonDetailContent } from '@/pages/class/LessonDetail';

interface LoginRequiredDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const LoginRequiredDialogNext = (props: LoginRequiredDialogProps) => {
	const router = useRouter();
	return <LoginRequiredDialogContent {...props} onConfirm={() => router.push('/login')} />;
};

export default function LessonClient({ lessonId }: { lessonId: string }) {
	const router = useRouter();

	return (
		<LessonDetailContent
			lessonId={lessonId}
			navigate={(path) => router.push(path)}
			onBack={() => router.back()}
			LoginRequiredDialogComponent={LoginRequiredDialogNext}
			useApplicationConfirmationHook={useLessonApplicationConfirmationNext}
		/>
	);
}
