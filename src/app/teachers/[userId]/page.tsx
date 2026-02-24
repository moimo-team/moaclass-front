import TeacherProfileClient from '@/app/teachers/[userId]/TeacherProfileClient';

type Props = {
	params: Promise<{ userId: string }>;
};

export default async function TeacherDetailPage({ params }: Props) {
	return <TeacherProfileClient params={params} />;
}
