import { useState, useEffect } from 'react';

import { ReviewList } from '@components/features/lessons/ReviewList';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaMapMarkerAlt } from 'react-icons/fa';

import defaultProfileImage from '@/assets/images/profile.png';
import KakaoMapView from '@/components/features/map/kakaoMaps/KakaoMapView';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { TeacherProfile } from '@/models/lesson.model';
import type { Review } from '@/models/review.model';

interface LessonTabContentProps {
	activeTab: string;
	tabTitles: { id: string; title: string }[];
	handleTabClick: (id: string) => void;
	onSectionRef: (id: string, el: HTMLElement | null) => void;
	description: string;
	curriculum: string;
	teacher: TeacherProfile;
	latitude: number;
	longitude: number;
	address: string;
	detailAddress: string;
	directionsText: string;
	navigate: (path: string) => void;
	reviewAiSummary: string | null;
	reviews: Review[];
}

export const LessonTabContent = ({
	activeTab,
	tabTitles,
	handleTabClick,
	onSectionRef,
	description,
	curriculum,
	teacher,
	latitude,
	longitude,
	address,
	detailAddress,
	directionsText,
	navigate,
	reviewAiSummary,
	reviews,
}: LessonTabContentProps) => {
	const [isMapReady, setIsMapReady] = useState(false);
	const hasReviewAiSummary = Boolean(reviewAiSummary?.trim());
	const teacherProfileImage =
		teacher?.image && teacher.image.trim().length > 0 ? teacher.image : defaultProfileImage;

	useEffect(() => {
		if (typeof window === 'undefined') return;

		let isCancelled = false;

		const tryLoadMap = () => {
			if (!window.kakao?.maps) return false;
			window.kakao.maps.load(() => {
				if (!isCancelled) {
					setIsMapReady(true);
				}
			});
			return true;
		};

		if (tryLoadMap()) {
			return () => {
				isCancelled = true;
			};
		}

		const retryTimer = window.setTimeout(() => {
			tryLoadMap();
		}, 300);

		return () => {
			isCancelled = true;
			window.clearTimeout(retryTimer);
		};
	}, []);

	return (
		<>
			{/* 탭 네비게이션 */}
			<nav
				className="sticky top-[80px] z-20 rounded-b-xl border border-border/60 bg-muted shadow-sm"
				aria-label="클래스 상세 탭"
			>
				<div className="flex items-center gap-1 overflow-x-auto scrollbar-hide px-2 py-2 sm:px-4 sm:py-3 lg:px-6">
					{tabTitles.map((tab) => (
						<Button
							key={tab.id}
							variant="ghost"
							className={cn(
								'whitespace-nowrap rounded-none border-b-2 border-transparent px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:px-4 sm:py-2.5 sm:text-base lg:px-5',
								activeTab === tab.id && 'border-primary text-foreground',
							)}
							onClick={() => handleTabClick(tab.id)}
						>
							{tab.title}
						</Button>
					))}
				</div>
			</nav>

			{/* 클래스 정보 섹션 */}
			<div className="space-y-8" aria-label="클래스 상세 콘텐츠">
				<motion.section
					id="intro"
					ref={(el) => onSectionRef('intro', el)}
					className="scroll-mt-[164px]"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: false, margin: '-50px' }}
					transition={{ duration: 0.5 }}
				>
					<Card className="border-2 border-border/50 shadow-sm overflow-hidden rounded-xl">
						<CardHeader className="bg-primary/5 pb-4 border-b border-border/50">
							<CardTitle className="text-xl font-bold">클래스 소개</CardTitle>
						</CardHeader>
						<CardContent className="p-6">
							<div className="text-base text-foreground whitespace-pre-wrap leading-relaxed">
								{description}
							</div>
						</CardContent>
					</Card>
				</motion.section>

				<motion.section
					id="curriculum"
					ref={(el) => onSectionRef('curriculum', el)}
					className="scroll-mt-[164px]"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: false, margin: '-50px' }}
					transition={{ duration: 0.5, delay: 0.1 }}
				>
					<Card className="border-2 border-border/50 shadow-sm overflow-hidden rounded-xl">
						<CardHeader className="bg-primary/5 pb-4 border-b border-border/50">
							<CardTitle className="text-xl font-bold">커리큘럼</CardTitle>
						</CardHeader>
						<CardContent className="p-6">
							<div className="text-base text-foreground whitespace-pre-wrap leading-relaxed">
								{curriculum}
							</div>
						</CardContent>
					</Card>
				</motion.section>

				<motion.section
					id="momento"
					ref={(el) => onSectionRef('momento', el)}
					className="scroll-mt-[164px]"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: false, margin: '-50px' }}
					transition={{ duration: 0.5, delay: 0.1 }}
				>
					<Card className="border-2 border-border/50 shadow-sm overflow-hidden rounded-xl">
						<CardHeader className="bg-primary/5 pb-4 border-b border-border/50">
							<CardTitle className="text-xl font-bold">모멘토 소개</CardTitle>
						</CardHeader>
						<CardContent className="p-6">
							{teacher && (
								<div className="flex items-center gap-4 mb-6 p-4 border rounded-lg bg-secondary/10">
									<Image
										src={teacherProfileImage}
										alt={teacher.nickname}
										width={80}
										height={80}
										className="w-20 h-20 rounded-full object-cover border border-border flex-shrink-0"
									/>
									<div className="flex-1">
										<h3 className="text-xl font-semibold mb-1">
											{teacher.nickname}
										</h3>
										<Button
											variant="link"
											className="p-0 h-auto text-primary text-sm hover:underline"
											onClick={() => navigate(`/teachers/${teacher.id}`)}
										>
											모멘토 페이지 바로가기
										</Button>
									</div>
								</div>
							)}
							<p className="text-base text-foreground whitespace-pre-wrap leading-relaxed">
								{teacher?.introduction || '모멘토 소개가 없습니다.'}
							</p>
						</CardContent>
					</Card>
				</motion.section>

				<motion.section
					id="location"
					ref={(el) => onSectionRef('location', el)}
					className="scroll-mt-[164px]"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: false, margin: '-50px' }}
					transition={{ duration: 0.5 }}
				>
					<Card className="border-2 border-border/50 shadow-sm overflow-hidden rounded-xl">
						<CardHeader className="bg-primary/5 pb-4 border-b border-border/50">
							<CardTitle className="text-xl font-bold">위치</CardTitle>
						</CardHeader>
						<CardContent className="p-0">
							<div className="w-full h-96 bg-muted relative">
								{isMapReady ? (
									<KakaoMapView
										lat={latitude}
										lng={longitude}
										placeName={address}
										level={3}
									/>
								) : (
									<div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
										<div className="text-center">
											<FaMapMarkerAlt className="w-8 h-8 mx-auto mb-2 opacity-50" />
											<p>지도를 불러오는 중입니다...</p>
										</div>
									</div>
								)}
							</div>
							<div className="p-4 bg-card border-t border-border/50">
								<p className="text-base font-medium text-foreground flex items-center gap-2">
									<FaMapMarkerAlt className="w-5 h-5 text-primary" />
									{address} {detailAddress}
								</p>
								<p className="text-sm text-muted-foreground mt-2">
									{directionsText}
								</p>
							</div>
						</CardContent>
					</Card>
				</motion.section>

				<motion.section
					id="reviews"
					ref={(el) => onSectionRef('reviews', el)}
					className="scroll-mt-[164px]"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: false, margin: '-50px' }}
					transition={{ duration: 0.5 }}
				>
					<Card className="border-2 border-border/50 shadow-sm overflow-hidden rounded-xl">
						<CardHeader className="bg-primary/5 pb-4 border-b border-border/50">
							<CardTitle className="text-xl font-bold">후기</CardTitle>
						</CardHeader>
						<CardContent className="p-6 space-y-4">
							{hasReviewAiSummary && (
								<Card className="border border-border/70 bg-secondary/10">
									<CardHeader className="pb-2">
										<CardTitle className="text-lg font-semibold">
											AI 리뷰 요약
										</CardTitle>
									</CardHeader>
									<CardContent className="pt-0">
										<p className="text-sm text-muted-foreground mb-2">
											모멘티들이 작성한 리뷰를 AI로 요약한 내용입니다.
										</p>
										<div className="text-base text-foreground whitespace-pre-wrap leading-relaxed">
											{reviewAiSummary}
										</div>
									</CardContent>
								</Card>
							)}
							<ReviewList reviews={reviews} />
						</CardContent>
					</Card>
				</motion.section>
			</div>
		</>
	);
};
