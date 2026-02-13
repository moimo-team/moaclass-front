import React, { useCallback, useState } from 'react';

import StarRating from '@/components/common/StarRating';
import { FormImageUpload } from '@/components/features/modal/components/FormImageUpload';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface ReviewModalProps {
	/** 모달 오픈 상태 */
	open: boolean;
	/** 모달 오픈 상태 변경 함수 */
	onOpenChange: (open: boolean) => void;
	/** 후기를 작성할 주문 아이디 */
	orderId?: number;
}

/**
 * 클래스 수강 완료 후 후기를 작성할 수 있는 모달 컴포넌트입니다.
 * 별점 부여, 텍스트 후기 작성, 이미지/동영상 첨부 기능을 포함합니다.
 */
const ReviewModal: React.FC<ReviewModalProps> = ({ open, onOpenChange, orderId }) => {
	// 별점 상태 (0.5 ~ 5.0)
	const [rating, setRating] = useState(0);
	// 후기 텍스트 내용 상태
	const [content, setContent] = useState('');
	// 첨부된 이미지 데이터 URL 리스트 상태
	const [images, setImages] = useState<string[]>([]);

	// 이미지 삭제 콜백
	const handleRemoveImage = useCallback((index: number) => {
		setImages((prev) => prev.filter((_, i) => i !== index));
	}, []);

	/**
	 * 후기 등록 버튼 클릭 시 처리
	 */
	const handleRegister = () => {
		// TODO: 실제 서버 API 연동 필요
		console.log('후기 등록 데이터:', { orderId, rating, content, images });
		onOpenChange(false); // 등록 후 모달 닫기
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[440px] p-0 overflow-hidden bg-white gap-0 rounded-none sm:rounded-none border-none">
				<div className="p-8 flex flex-col items-center gap-8">
					{/* 상단: 별점 평가 섹션 */}
					<div className="text-center space-y-3">
						<h2 className="text-lg font-bold text-gray-900">클래스에 만족하셨나요?</h2>
						<StarRating
							rating={rating}
							isEditable
							onChange={setRating}
							starSize={48}
							className="justify-center"
							filledColor="text-yellow-400"
							emptyColor="text-gray-200"
						/>
						<p className="text-sm text-gray-400">
							{rating > 0 ? `${rating}점을 주셨네요!` : '선택하세요.'}
						</p>
					</div>

					{/* 중단: 텍스트 후기 내용 섹션 */}
					<div className="w-full space-y-4">
						<h3 className="text-lg font-bold text-center text-gray-900">
							어떤 점이 좋았나요?
						</h3>
						<div className="relative">
							<Textarea
								placeholder="(최소 10자 이상)"
								className="min-h-[220px] resize-none border-gray-200 bg-white placeholder:text-gray-300 text-sm p-4 focus:ring-0 focus:border-purple-300 rounded-sm"
								value={content}
								onChange={(e) => setContent(e.target.value)}
								maxLength={5000}
							/>
							{/* 실시간 글자 수 카운터 */}
							<div className="absolute bottom-4 right-4 text-xs text-gray-300">
								{content.length.toLocaleString()} / 5,000
							</div>
						</div>
					</div>

					{/* 하단: 파일 첨부 섹션 (공통 컴포넌트 활용 - FormImageUpload로 통합) */}
					<div className="w-full space-y-4">
						<FormImageUpload
							variant="multiple"
							previewImages={images}
							onImagesChange={setImages}
							onRemoveImage={handleRemoveImage}
							maxImages={8}
							enableDragAndDrop={true}
							dragDropHintText={
								<p>
									첨부하면{' '}
									<span className="text-emerald-500 font-bold">
										같은 카테고리 클래스 할인 쿠폰 발급!
									</span>
								</p>
							}
							label="이미지 첨부"
						/>

						{/* 포인트 적립 안내 문구 */}
						<p className="text-[11px] leading-snug text-emerald-500 font-bold whitespace-pre-wrap">
							후기를 등록하면 포인트 1,000원 적립!
						</p>
					</div>
				</div>

				{/* 모달 하단 버튼 영역 */}
				<DialogFooter className="p-4 flex-row gap-3 border-t bg-white sm:justify-between">
					<Button
						variant="outline"
						className="flex-1 h-12 text-base font-bold text-gray-900 border-gray-200 hover:bg-gray-50 rounded-sm"
						onClick={() => onOpenChange(false)}
					>
						취소
					</Button>
					<Button
						className={cn(
							'flex-1 h-12 text-base font-bold text-white transition-colors rounded-sm shadow-none',
							content.length >= 10 && rating > 0
								? 'bg-[#C4B5FD] hover:bg-[#A78BFA]' // 유효성 검사 통과 시 활성 색상 (연보라)
								: 'bg-[#E5E7EB] cursor-not-allowed text-gray-400', // 미달 시 비활성 색상
						)}
						onClick={handleRegister}
						disabled={content.length < 10 || rating === 0} // 별점(>0) 및 내용(>=10자) 필수
					>
						등록
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default ReviewModal;
