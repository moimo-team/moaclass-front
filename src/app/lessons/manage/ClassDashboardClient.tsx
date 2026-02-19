'use client';

import { useRouter } from 'next/navigation';

import { ClassDashboardContent } from '@/pages/class/ClassDashboardPage';

export default function ClassDashboardClient() {
	const router = useRouter();

	return <ClassDashboardContent onNavigate={(path) => router.push(path)} />;
}
