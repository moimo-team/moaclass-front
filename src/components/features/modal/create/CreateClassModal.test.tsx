import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// 훅 모킹
const mockMutateAsync = vi.fn().mockResolvedValue({});

vi.mock('@/hooks/useCategoryQuery', () => ({
	useCategoryQuery: vi.fn(() => ({
		data: [
			{ id: 1, name: '핸드메이드' },
			{ id: 2, name: '베이킹' },
		],
		isLoading: false,
		isSuccess: true,
	})),
	useSubCategoryQuery: vi.fn((categoryId) => ({
		data:
			categoryId === 1
				? [
						{ id: 101, name: '향수' },
						{ id: 102, name: '비누' },
					]
				: [],
		isLoading: false,
		isSuccess: true,
	})),
}));

vi.mock('@/hooks/useLessonMutations', () => ({
	useCreateLessonMutation: vi.fn(() => ({
		mutateAsync: mockMutateAsync,
		isPending: false,
	})),
	useUpdateLessonMutation: vi.fn(() => ({
		mutateAsync: vi.fn().mockResolvedValue({}),
		isPending: false,
	})),
}));

vi.mock('@/hooks/useLessonQuery', () => ({
	useLessonQuery: vi.fn(() => ({
		data: null,
		isLoading: false,
	})),
}));

vi.mock('@/api/client', () => ({
	apiClient: {
		get: vi.fn(),
		post: vi.fn(),
		put: vi.fn(),
		delete: vi.fn(),
		interceptors: {
			request: { use: vi.fn(), eject: vi.fn() },
			response: { use: vi.fn(), eject: vi.fn() },
		},
	},
}));

vi.mock('sonner', () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
		info: vi.fn(),
	},
}));

vi.mock('@/components/features/map/kakaoMaps/KakaoMapSearch', () => ({
	default: ({ onPlaceSelect }: { onPlaceSelect: any }) => (
		<div data-testid="kakao-map-mock">
			<button
				onClick={() => onPlaceSelect({ roadAddress: '서울시 강남구', lat: 37, lng: 127 })}
				type="button"
			>
				Select Place
			</button>
		</div>
	),
}));

import CreateClassModal from './CreateClassModal';

const createTestQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: { retry: false, gcTime: 0 },
		},
	});

describe('CreateClassModal', () => {
	let queryClient: QueryClient;

	beforeEach(() => {
		queryClient = createTestQueryClient();
		vi.clearAllMocks();
		mockMutateAsync.mockClear();
	});

	const renderModal = (props = {}) => {
		const defaultProps = {
			open: true,
			onOpenChange: vi.fn(),
			...props,
		};

		return render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<CreateClassModal {...defaultProps} />
				</MemoryRouter>
			</QueryClientProvider>,
		);
	};

	it('생성 모드에서 올바른 제목을 렌더링해야 한다', async () => {
		renderModal();
		expect(await screen.findByText('새 클래스 만들기')).toBeInTheDocument();
	});

	it.only('가격을 입력하면 할인율에 따라 최종 판매가가 계산되어야 한다', async () => {
		renderModal();

		// 1. 카테고리 선택 (isFormReady 달성)
		const categoryBadge = await screen.findByText('핸드메이드');
		await userEvent.click(categoryBadge);
		const subCategoryBadge = await screen.findByText('향수');
		await userEvent.click(subCategoryBadge);

		// 2. 폼이 준비될 때까지 잠시 대기
		await screen.findByText(/최종 판매가/);

		const priceInput = screen.getByLabelText(/가격/i);
		const discountInput = screen.getByLabelText(/할인율/i);

		// 3. 값 입력 전에 소분류 등이 선택되어 useEffect 리셋이 끝났는지 확인
		// (충분한 비동기 대기)
		await new Promise((r) => setTimeout(r, 500));

		// 4. 입력
		await userEvent.clear(priceInput);
		await userEvent.type(priceInput, '10000');
		await userEvent.clear(discountInput);
		await userEvent.type(discountInput, '10');

		// 5. 결과 확인
		await waitFor(
			() => {
				const parent = screen.getByText(/최종 판매가/).parentElement;
				// 9,000 혹은 9000 포함 확인
				expect(parent?.textContent).toMatch(/9[,]?000/);
			},
			{ timeout: 3000 },
		);
	});

	it('대분류 카테고리를 선택하면 소분류 카테고리가 나타나야 한다', async () => {
		renderModal();
		const categoryBadge = await screen.findByText('핸드메이드');
		await userEvent.click(categoryBadge);
		expect(await screen.findByText('향수')).toBeInTheDocument();
	});

	it('모든 필드가 유효할 때 버튼을 누르면 생성 API가 호출되어야 한다', async () => {
		renderModal();

		const categoryBadge = await screen.findByText('핸드메이드');
		await userEvent.click(categoryBadge);

		const subCategoryBadge = await screen.findByText('향수');
		await userEvent.click(subCategoryBadge);

		const titleInput = await screen.findByLabelText(/클래스명/i);
		await userEvent.type(titleInput, '테스트 클래스');

		const mapButton = screen.getByText('Select Place');
		await userEvent.click(mapButton);

		const submitButton = screen.getByRole('button', { name: /생성하기/i });

		await waitFor(
			() => {
				expect(submitButton).not.toBeDisabled();
			},
			{ timeout: 3000 },
		);

		await userEvent.click(submitButton);

		await waitFor(
			() => {
				expect(mockMutateAsync).toHaveBeenCalled();
			},
			{ timeout: 3000 },
		);
	});
});
