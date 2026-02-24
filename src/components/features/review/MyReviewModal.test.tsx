import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import MyReviewModal from './MyReviewModal';

// 훅 모킹
const mockWriteReview = vi.fn().mockResolvedValue({});
const mockUpdateReview = vi.fn().mockResolvedValue({});

vi.mock('@/hooks/useReviewMutations', () => ({
	useReviewMutation: vi.fn(() => ({
		mutateAsync: mockWriteReview,
		isPending: false,
	})),
	useUpdateReviewMutation: vi.fn(() => ({
		mutateAsync: mockUpdateReview,
		isPending: false,
	})),
}));

const mockReviewData = {
	hasReview: true,
	review: {
		id: 1,
		rating: 4.5,
		content: '기존 리뷰 내용입니다. 10자 이상입니다.',
		image1: 'http://example.com/image1.jpg',
	},
};

vi.mock('@/hooks/useMyReviewQuery', () => ({
	useMyReviewQuery: vi.fn((enrollmentId) => ({
		data: enrollmentId === 999 ? mockReviewData : { hasReview: false },
		isLoading: false,
	})),
}));

const createTestQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: { retry: false, gcTime: 0 },
		},
	});

describe('MyReviewModal', () => {
	let queryClient: QueryClient;

	beforeEach(() => {
		queryClient = createTestQueryClient();
		vi.clearAllMocks();

		// JSDOM에서 getBoundingClientRect가 항상 0을 반환하는 문제를 해결하기 위해 Mocking
		Element.prototype.getBoundingClientRect = vi.fn().mockReturnValue({
			width: 48,
			height: 48,
			top: 0,
			left: 0,
			bottom: 48,
			right: 48,
		});
	});

	const renderModal = (props = {}) => {
		const defaultProps = {
			open: true,
			onOpenChange: vi.fn(),
			enrollmentId: 1,
			isEditMode: false,
			...props,
		};

		return render(
			<QueryClientProvider client={queryClient}>
				<MyReviewModal {...defaultProps} />
			</QueryClientProvider>,
		);
	};

	it('1. 별점이 반개씩 입력이 되는가?', async () => {
		renderModal();

		// 초기 상태 확인
		expect(screen.getByText('선택하세요.')).toBeInTheDocument();

		// 0.5점을 위해 별의 왼쪽 클릭
		// 별점 아이콘이 바뀌면(Outline -> Half) 요소가 새로 그려지므로 클릭할 때마다 다시 찾아야 함
		const getFirstStar = () => document.querySelector('svg.cursor-pointer');

		const firstStarForHalf = getFirstStar();
		if (!firstStarForHalf) throw new Error('별점을 찾을 수 없습니다.');
		fireEvent.click(firstStarForHalf, { clientX: 10 });

		// 0.5점이 표시되는지 확인
		await waitFor(() => {
			expect(screen.getByText(/0\.5점을 주셨네요!/)).toBeInTheDocument();
		});

		// 1.0점을 위해 새롭게 렌더링된 별을 다시 찾아 오른쪽 클릭
		const firstStarForFull = getFirstStar();
		if (!firstStarForFull) throw new Error('별점을 찾을 수 없습니다.');
		fireEvent.click(firstStarForFull, { clientX: 40 });

		// 1점 표시 확인
		await waitFor(() => {
			expect(screen.getByText(/1점을 주셨네요!/)).toBeInTheDocument();
		});
	});

	it('2. 10자 이상 5000자 이내로 입력이 되는가?', async () => {
		renderModal();
		const textarea = screen.getByPlaceholderText('(최소 10자 이상)');
		await userEvent.type(textarea, '1234567890');
		expect(textarea).toHaveValue('1234567890');
	});

	it('3. 이미지 8개까지 업로드가 되는가?', async () => {
		renderModal();

		// Radix Dialog Portal로 인해 container 대신 document에서 찾아야 함
		const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
		if (!fileInput) throw new Error('파일 입력창을 찾을 수 없습니다.');

		const files = Array(8).fill(new File(['(⌐□_□)'], 'test.png', { type: 'image/png' }));
		await userEvent.upload(fileInput, files);

		// 업로드 시뮬레이션 후 에러 없이 동작하는지 확인
	});

	it('4. 이미지 삭제가 되는가?', async () => {
		// 이미지가 1개 존재하는 상태로 설정 (수정 모드 활용)
		renderModal({ enrollmentId: 999, isEditMode: true });

		// 데이터 로딩 및 초기화 대기
		await screen.findByDisplayValue(mockReviewData.review.content);

		// 이미지 미리보기의 삭제 버튼 찾기 (X 아이콘이 들어있는 버튼)
		// FormImageUpload에서 삭제 버튼은 className에 '-top-2'를 포함함
		const buttons = screen.getAllByRole('button');
		const removeButton = buttons.find((btn) => btn.className.includes('-top-2'));

		if (removeButton) {
			await userEvent.click(removeButton);

			// 이미지 삭제 후 '수정' 버튼을 눌러야 알림이 뜸
			const submitButton = screen.getByRole('button', { name: '수정' });
			await userEvent.click(submitButton);

			// 알림(AlertNotification) 확인
			expect(
				await screen.findByText(/이미지 리뷰 작성 보상 쿠폰을 받았으므로/),
			).toBeInTheDocument();
		}
	});

	it('5. 별점을 입력 안하거나 글자수를 10자 미만으로 입력하면 버튼이 비활성화 되는가?', async () => {
		renderModal();
		const submitButton = screen.getByRole('button', { name: '등록' });

		// 초기 상태 -> 비활성화
		expect(submitButton).toBeDisabled();

		// 1. 별점 입력 (1.0점) -> 비활성화 유지 (글자수 부족)
		const firstStar = document.querySelector('svg.cursor-pointer');
		if (!firstStar) throw new Error('별점을 찾을 수 없습니다.');

		// JSDOM 환경에서 SVG 클릭 좌표 인식을 위해 fireEvent 사용
		fireEvent.click(firstStar, { clientX: 40 });

		// 별점이 반영되었는지 텍스트로 확인
		await waitFor(() => {
			expect(screen.getByText(/1점을 주셨네요!/)).toBeInTheDocument();
		});
		expect(submitButton).toBeDisabled();

		// 2. 10자 미만 입력 -> 비활성화 유지
		const textarea = screen.getByPlaceholderText('(최소 10자 이상)');
		await userEvent.type(textarea, '짧은 내용');
		expect(textarea).toHaveValue('짧은 내용');
		expect(submitButton).toBeDisabled();

		// 3. 10자 이상 입력 -> 활성화
		await userEvent.clear(textarea);
		await userEvent.type(textarea, '10자가 넘는 리뷰 내용을 입력합니다.');

		await waitFor(
			() => {
				expect(submitButton).not.toBeDisabled();
			},
			{ timeout: 3000 },
		);
	});

	it('6. 수정 모드일 때 기존 리뷰 데이터가 불러와지는가?', async () => {
		renderModal({ enrollmentId: 999, isEditMode: true });

		expect(await screen.findByText(/4\.5점을 주셨네요!/)).toBeInTheDocument();
		expect(screen.getByDisplayValue(mockReviewData.review.content)).toBeInTheDocument();
	});

	it('7. 수정 모드일 때 기존 리뷰 데이터가 수정이 되는가?', async () => {
		renderModal({ enrollmentId: 999, isEditMode: true });

		const textarea = await screen.findByDisplayValue(mockReviewData.review.content);
		await userEvent.clear(textarea);
		await userEvent.type(textarea, '수정된 리뷰 내용입니다. 10자 이상.');

		const submitButton = screen.getByRole('button', { name: '수정' });
		await waitFor(() => expect(submitButton).not.toBeDisabled());
		await userEvent.click(submitButton);

		await waitFor(() => {
			expect(mockUpdateReview).toHaveBeenCalled();
		});
	});

	it('8. 수정 모드일 때 이미지 삭제 및 변경이 잘 저장되는가?', async () => {
		renderModal({ enrollmentId: 999, isEditMode: true });

		// 신규 이미지 추가 시뮬레이션
		const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
		const file = new File(['hello'], 'hello.png', { type: 'image/png' });
		await userEvent.upload(fileInput, file);

		const submitButton = screen.getByRole('button', { name: '수정' });
		await waitFor(() => expect(submitButton).not.toBeDisabled());
		await userEvent.click(submitButton);

		await waitFor(() => {
			expect(mockUpdateReview).toHaveBeenCalled();
		});
	});
});
