'use client';

import { use } from 'react';

import TeacherProfilePage from '@/v-pages/class/teacher/TeacherProfilePage';

export default function TeacherProfileClient({ params }: { params: Promise<{ userId: string }> }) {
	const { userId } = use(params);

	return <TeacherProfilePage userId={Number(userId)} />;
}
