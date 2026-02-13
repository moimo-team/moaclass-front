import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Toaster } from '@/components/ui/sonner';

import { useAuthQuery } from './hooks/useAuthQuery';
import { routeList } from './routes/routeList';

const router = createBrowserRouter(routeList);

function App() {
	// 사용자 인증 상태 확인
	useAuthQuery();

	return (
		<>
			<RouterProvider router={router} />
			<Toaster
				position="top-center"
				expand={true}
				richColors
				duration={3000}
				toastOptions={{
					style: {
						fontSize: '14px',
						padding: '16px',
					},
					className: 'font-medium',
				}}
			/>
		</>
	);
}

export default App;
