import { useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import LoadingSpinner from '@/components/common/LoadingSpinner';
import PaginationComponent from '@/components/common/PaginationComponent';
import LessonCard from '@/components/features/lessons/LessonCard';
import { useCancelLikeMutation } from '@/hooks/useLikeMutations';
import { useWishlistQuery } from '@/hooks/useWishlistQuery';
import { convertWishlistItemToLesson } from '@/models/wishlist.model';

const ITEMS_PER_PAGE = 6;

const WishList = () => {
	const [page, setPage] = useState(1);
	const { wishlist, totalPages, isLoading, isError, error } = useWishlistQuery(
		page,
		ITEMS_PER_PAGE,
	);

	const cancelLikeMutation = useCancelLikeMutation();

	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (isError) {
		return (
			<p className="text-center text-red-500">
				위시리스트를 불러오는 중 에러가 발생했습니다: {error?.message}
			</p>
		);
	}

	const handleToggleLike = async (lessonId: number, isLiked: boolean) => {
		if (isLiked) {
			await cancelLikeMutation.mutateAsync(lessonId);
		}
	};

	return (
		<div className="max-w-6xl mx-auto w-full p-6 space-y-6 bg-white min-h-screen">
			{/* 헤더 영역 */}
			<div className="flex justify-between items-center mb-2">
				<h1 className="text-2xl font-bold text-foreground">위시리스트</h1>
			</div>

			<p className="text-gray-500 mb-6 font-medium">
				총 <span className="text-primary font-bold">{wishlist.length}</span>개의 찜한
				클래스가 있습니다.
			</p>

			{/* 위시리스트 그리드 */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				<AnimatePresence mode="popLayout">
					{wishlist.map((wishLesson) => (
						<motion.div
							key={wishLesson.lessonId}
							layout
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
							transition={{ duration: 0.2 }}
							className="w-full"
						>
							<LessonCard
								lesson={convertWishlistItemToLesson(wishLesson)}
								onToggleLike={() => handleToggleLike(wishLesson.lessonId, true)}
							/>
						</motion.div>
					))}
				</AnimatePresence>
			</div>

			{/* 빈 상태 */}
			{wishlist.length === 0 && (
				<div className="flex flex-col items-center justify-center py-32 text-gray-400">
					<p className="text-lg font-medium">찜한 클래스가 없습니다.</p>
					<p className="text-sm">마음에 드는 클래스를 직접 찜해보세요!</p>
				</div>
			)}

			{/* 페이지네이션 */}
			{totalPages > 0 && (
				<div className="py-8">
					<PaginationComponent totalPages={totalPages} page={page} setPage={setPage} />
				</div>
			)}
		</div>
	);
};

export default WishList;
