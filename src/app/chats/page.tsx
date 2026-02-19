import ChattingClient from '@/app/chats/ChattingClient';
import ProtectedRouteNext from '@/components/common/next/ProtectedRouteNext';
import { createPageMetadata } from '@/utils/metadata';

export const metadata = createPageMetadata({
	title: '메시지',
	description: '채팅 페이지',
	noindex: true,
});

export default function Page() {
	return (
		<ProtectedRouteNext>
			<ChattingClient />
		</ProtectedRouteNext>
	);
}
