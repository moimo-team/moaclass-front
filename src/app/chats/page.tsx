import ChattingClient from '@/app/chats/ChattingClient';
import ProtectedRoute from '@/components/common/protected/ProtectedRoute';
import { createPageMetadata } from '@/utils/metadata';

export const metadata = createPageMetadata({
	title: '메시지',
	description: '채팅 페이지',
	noindex: true,
});

export default function Page() {
	return (
		<ProtectedRoute>
			<ChattingClient />
		</ProtectedRoute>
	);
}
