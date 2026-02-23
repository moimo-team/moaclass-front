import type { PropsWithChildren, ReactElement } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

export const createTestQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
			mutations: {
				retry: false,
			},
		},
	});

export const renderHome = (ui: ReactElement) => {
	const queryClient = createTestQueryClient();

	const Wrapper = ({ children }: PropsWithChildren) => (
		<QueryClientProvider client={queryClient}>
			<MemoryRouter>{children}</MemoryRouter>
		</QueryClientProvider>
	);

	return render(ui, { wrapper: Wrapper });
};
