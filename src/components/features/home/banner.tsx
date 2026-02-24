import { useEffect, useState } from 'react';

import Autoplay from 'embla-carousel-autoplay';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import LoginRequiredClientDialog from '@/app/lessons/[lessonId]/_components/LoginRequiredClientDialog';
import bannerCookingImage from '@/assets/images/banner-cooking.webp';
import bannerCouponImage from '@/assets/images/banner-coupon.webp';
import bannerMeetingImage from '@/assets/images/banner-meeting.webp';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
	type CarouselApi,
} from '@/components/ui/carousel';
import { BANNER_COUPON_CODE, BANNER_COUPON_ID } from '@/constants/coupon';
import { useIssueCouponMutation } from '@/hooks/useCouponMutations';
import { useUserCouponsQuery } from '@/hooks/useCouponQuery';
import { useAuthStore } from '@/store/authStore';

export { BANNER_COUPON_ID, BANNER_COUPON_CODE };

const getStatusCode = (error: unknown): number | undefined => {
	if (typeof error !== 'object' || error === null || !('response' in error)) {
		return undefined;
	}

	const response = error.response;
	if (typeof response !== 'object' || response === null || !('status' in response)) {
		return undefined;
	}

	const status = response.status;
	return typeof status === 'number' ? status : undefined;
};

interface BannerProps {
	onMeetingBannerClick?: () => void;
}

const containerVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.2,
			delayChildren: 0.3,
		},
	},
};

const itemVariants: Variants = {
	hidden: { opacity: 0, y: 30 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.8,
			ease: [0.215, 0.61, 0.355, 1],
		},
	},
};

function Banner({ onMeetingBannerClick }: BannerProps) {
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);
	const [isCouponIssued, setIsCouponIssued] = useState(false);
	const [showLoginPrompt, setShowLoginPrompt] = useState(false);
	const { isLoggedIn, userId } = useAuthStore();
	const { data: userCoupons = [] } = useUserCouponsQuery({ enabled: isLoggedIn });
	const issueCouponMutation = useIssueCouponMutation();

	const hasIssuedCouponFromServer =
		isLoggedIn &&
		userCoupons.some(
			(coupon) =>
				coupon.couponId === BANNER_COUPON_ID ||
				coupon.id === BANNER_COUPON_ID ||
				coupon.code === BANNER_COUPON_CODE,
		);
	const hasIssuedCoupon = isCouponIssued || hasIssuedCouponFromServer;

	useEffect(() => {
		if (!api) {
			return;
		}

		const handleSelect = () => {
			setCurrent(api.selectedScrollSnap());
		};

		api.on('select', handleSelect);

		return () => {
			api.off('select', handleSelect);
		};
	}, [api]);

	useEffect(() => {
		if (hasIssuedCouponFromServer) {
			setIsCouponIssued(true);
		}
	}, [hasIssuedCouponFromServer]);

	const handleDotClick = (index: number) => {
		api?.scrollTo(index);
	};

	const handleCouponIssue = async () => {
		if (!isLoggedIn || !userId) {
			setShowLoginPrompt(true);
			return;
		}

		if (hasIssuedCoupon) {
			return;
		}

		try {
			await issueCouponMutation.mutateAsync({
				userId,
				couponId: BANNER_COUPON_ID,
			});
			setIsCouponIssued(true);
		} catch (error) {
			const statusCode = getStatusCode(error);
			if (statusCode === 409 || statusCode === 400) {
				setIsCouponIssued(true);
			}
		}
	};

	const bannerItems = [
		{
			id: 1,
			content: (
				<div className="w-full h-[550px] bg-accent flex items-center justify-center relative">
					<Image src={bannerCouponImage} alt="" fill priority className="object-cover" />
					<div className="absolute inset-0 bg-black/40 transition-opacity duration-700" />
					<AnimatePresence mode="wait">
						<motion.div
							key={`content-1-${current === 0}`}
							variants={containerVariants}
							initial="hidden"
							animate={current === 0 ? 'visible' : 'hidden'}
							className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6"
						>
							<div className="text-center space-y-3">
								<motion.h2
									variants={itemVariants}
									className="text-2xl md:text-3xl font-nanum-bold text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5)] tracking-tight"
								>
									새학기 맞이 원데이 클래스
								</motion.h2>
								<motion.p
									variants={itemVariants}
									className="text-3xl md:text-5xl font-nanum-extrabold text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]"
								>
									10% 할인 쿠폰 증정
								</motion.p>
							</div>
							<motion.div variants={itemVariants}>
								<Button
									size="lg"
									onClick={handleCouponIssue}
									disabled={issueCouponMutation.isPending || hasIssuedCoupon}
									data-testid="banner-coupon-button"
									className="bg-primary hover:bg-primary/90 text-white min-w-[160px] h-14 text-lg rounded-full shadow-lg transition-all hover:scale-105"
								>
									{hasIssuedCoupon ? (
										<>
											<Check className="mr-2 h-5 w-5" />
											발급 완료
										</>
									) : issueCouponMutation.isPending ? (
										<>
											<Loader2 className="mr-2 h-5 w-5 animate-spin" />
											쿠폰 발급 중
										</>
									) : (
										'쿠폰 받기'
									)}
								</Button>
							</motion.div>
						</motion.div>
					</AnimatePresence>
				</div>
			),
		},
		{
			id: 2,
			content: (
				<div className="w-full h-[550px] bg-green-100 flex items-center justify-center relative">
					<Image src={bannerMeetingImage} alt="" fill className="object-cover" />
					<div className="absolute inset-0 bg-black/40 transition-opacity duration-700" />
					<AnimatePresence mode="wait">
						<motion.div
							key={`content-2-${current === 1}`}
							variants={containerVariants}
							initial="hidden"
							animate={current === 1 ? 'visible' : 'hidden'}
							className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6"
						>
							<div className="text-center space-y-3">
								<motion.h2
									variants={itemVariants}
									className="text-2xl md:text-3xl font-nanum-bold text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5)] tracking-tight"
								>
									원데이 모임 구경하기
								</motion.h2>
								<motion.p
									variants={itemVariants}
									className="text-3xl md:text-5xl font-nanum-extrabold text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5)] max-w-2xl leading-tight"
								>
									다양한 주제의 모임으로
									<br />
									일상을 특별하게!
								</motion.p>
							</div>
							<motion.div variants={itemVariants}>
								<Button
									size="lg"
									className="bg-green-600 hover:bg-green-700 text-white min-w-[160px] h-14 text-lg rounded-full shadow-lg transition-all hover:scale-105"
									data-testid="banner-meeting-link"
									onClick={onMeetingBannerClick}
								>
									구경하기
								</Button>
							</motion.div>
						</motion.div>
					</AnimatePresence>
				</div>
			),
		},
		{
			id: 3,
			content: (
				<div className="w-full h-[550px] bg-yellow-100 flex items-center justify-center relative">
					<Image src={bannerCookingImage} alt="" fill className="object-cover" />
					<div className="absolute inset-0 bg-black/40 transition-opacity duration-700" />
					<AnimatePresence mode="wait">
						<motion.div
							key={`content-3-${current === 2}`}
							variants={containerVariants}
							initial="hidden"
							animate={current === 2 ? 'visible' : 'hidden'}
							className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6"
						>
							<div className="text-center space-y-3">
								<motion.h2
									variants={itemVariants}
									className="text-2xl md:text-3xl font-nanum-bold text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5)] tracking-tight"
								>
									쿠킹 클래스 찾기
								</motion.h2>
								<motion.p
									variants={itemVariants}
									className="text-3xl md:text-5xl font-nanum-extrabold text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]"
								>
									따뜻한 쿠킹으로 힐링하는 시간!
								</motion.p>
							</div>
							<motion.div variants={itemVariants}>
								<Button
									size="lg"
									className="bg-carrot hover:bg-carrot-hover text-white min-w-[160px] h-14 text-lg rounded-full shadow-lg transition-all hover:scale-105"
									asChild
								>
									<Link
										href="/lessons?categoryId=2&sort=LATEST"
										data-testid="banner-lesson-link"
									>
										클래스 구경하기
									</Link>
								</Button>
							</motion.div>
						</motion.div>
					</AnimatePresence>
				</div>
			),
		},
	];

	return (
		<div className="relative group left-1/2 right-1/2 ml-[-50vw] mr-[-50vw] w-screen overflow-hidden">
			<Carousel
				setApi={setApi}
				plugins={[
					Autoplay({
						delay: 8000,
						stopOnInteraction: true,
					}),
				]}
				opts={{
					align: 'start',
					loop: true,
					skipSnaps: true,
				}}
				className="w-full"
			>
				<CarouselContent className="-ml-0">
					{bannerItems.map((item) => (
						<CarouselItem key={item.id} className="pl-0">
							<Card className="border-none rounded-none overflow-hidden">
								<CardContent className="flex h-full items-center justify-center p-0">
									{item.content}
								</CardContent>
							</Card>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious className="absolute left-0 top-0 bottom-0 h-full w-32 bg-gray-500/10 hover:bg-gray-500/20 border-none text-white rounded-none translate-y-0 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]" />
				<CarouselNext className="absolute right-0 top-0 bottom-0 h-full w-32 bg-gray-500/10 hover:bg-gray-500/20 border-none text-white rounded-none translate-y-0 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]" />
			</Carousel>

			<div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
				{bannerItems.map((_, index) => (
					<button
						key={index}
						onClick={() => handleDotClick(index)}
						className={`h-1.5 rounded-full transition-all duration-300 ${
							current === index ? 'w-8 bg-white' : 'w-2 bg-white/50'
						}`}
						aria-label={`Go to slide ${index + 1}`}
					/>
				))}
			</div>
			<LoginRequiredClientDialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt} />
		</div>
	);
}

export default Banner;
