import { StrictMode } from 'react';

import './index.css';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';

import App from './App.tsx';
import { queryClient } from './lib/queryClient';
import { ENV } from './utils/env';
// import "pretendard/dist/web/static/pretendard.css";

async function enableMocking() {
	if (!ENV.IS_DEV || !ENV.ENABLE_MOCK) {
		return;
	}

	const { worker } = await import('./mock/browser');

	// `worker.start()` returns a Promise that resolves
	// once the Service Worker is up and ready to intercept requests.
	return worker.start({
		onUnhandledRequest: 'bypass',
	});
}

enableMocking().then(() => {
	const CLIENT_ID = ENV.GOOGLE_CLIENT_ID;

	createRoot(document.getElementById('root')!).render(
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<GoogleOAuthProvider clientId={CLIENT_ID || ''}>
					<App />
				</GoogleOAuthProvider>
			</QueryClientProvider>
		</StrictMode>,
	);
});
