import { useEffect, useState } from 'react';

import Autoplay from 'embla-carousel-autoplay';
import { Check, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

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
import { useIssueCouponMutation } from '@/hooks/useCouponMutations';
import { useUserCouponsQuery } from '@/hooks/useCouponQuery';
import { useAuthStore } from '@/store/authStore';

export const BANNER_COUPON_ID = 4;
export const BANNER_COUPON_CODE = 'NEW_SEMESTER_2026';

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

function Banner() {
	const negativeMarginClasses = '-mx-4 md:-mx-32';
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);
	const [isCouponIssued, setIsCouponIssued] = useState(false);
	const { isLoggedIn, userId } = useAuthStore();
	const { data: userCoupons = [] } = useUserCouponsQuery();
	const issueCouponMutation = useIssueCouponMutation();
	const navigate = useNavigate();

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
			navigate('/login');
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
				<div className="w-full h-full bg-accent flex items-center justify-center relative">
					<div className="absolute bottom-16 flex flex-col items-center gap-4">
						<div className="text-center">
							<h2 className="text-xl md:text-2xl font-bold text-primary">
								새학기 맞이 원데이 클래스
							</h2>
							<p className="text-2xl md:text-3xl font-bold text-primary">
								10% 할인 쿠폰 증정
							</p>
						</div>
						<Button
							onClick={handleCouponIssue}
							disabled={issueCouponMutation.isPending || hasIssuedCoupon}
							data-testid="banner-coupon-button"
							className="bg-primary hover:bg-primary/90 text-white"
						>
							{hasIssuedCoupon ? (
								<>
									<Check className="mr-2 h-4 w-4" />
									발급 완료
								</>
							) : issueCouponMutation.isPending ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									쿠폰 발급 중
								</>
							) : (
								'쿠폰 받기'
							)}
						</Button>
					</div>
				</div>
			),
		},
		{
			id: 2,
			content: (
				<div className="w-full h-full bg-green-100 flex items-center justify-center relative">
					<div className="absolute bottom-16 flex flex-col items-center gap-4">
						<div className="text-center">
							<h2 className="text-xl md:text-2xl font-bold text-green-800">
								원데이 모임 구경하기
							</h2>
							<p className="text-2xl md:text-3xl font-bold text-foreground">
								다양한 주제의 모임으로 일상을 특별하게!
							</p>
						</div>
						<Button className="bg-green-600 hover:bg-green-700 text-white" asChild>
							<Link to="/" data-testid="banner-meeting-link">
								구경하기
							</Link>
						</Button>
					</div>
				</div>
			),
		},
		{
			id: 3,
			content: (
				<div className="w-full h-full bg-yellow-100 flex items-center justify-center relative">
					<div className="absolute bottom-16 flex flex-col items-center gap-4">
						<div className="text-center">
							<h2 className="text-xl md:text-2xl font-bold text-carrot">
								쿠킹 클래스 찾기
							</h2>
							<p className="text-2xl md:text-3xl font-bold text-carrot">
								따뜻한 쿠킹으로 힐링하는 시간!
							</p>
						</div>
						<Button className="bg-carrot hover:bg-carrot-hover text-white" asChild>
							<Link to="/lessons?category=쿠킹" data-testid="banner-lesson-link">
								클래스 구경하기
							</Link>
						</Button>
					</div>
				</div>
			),
		},
	];

	return (
		<div className={`relative w-screen ${negativeMarginClasses}`}>
			<Carousel
				setApi={setApi}
				plugins={[
					Autoplay({
						delay: 5000,
						stopOnInteraction: true,
					}),
				]}
				opts={{
					align: 'start',
					loop: true,
				}}
				className="w-full"
			>
				<CarouselContent>
					{bannerItems.map((item) => (
						<CarouselItem key={item.id}>
							<Card className="border-none">
								<CardContent className="flex h-80 items-center justify-center p-0">
									{item.content}
								</CardContent>
							</Card>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10" />
				<CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10" />
			</Carousel>

			<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
				{bannerItems.map((_, index) => (
					<button
						key={index}
						onClick={() => handleDotClick(index)}
						className={`w-2 h-2 rounded-full ${
							current === index ? 'bg-gray-800' : 'bg-gray-400'
						}`}
						aria-label={`Go to slide ${index + 1}`}
					/>
				))}
			</div>
		</div>
	);
}

export default Banner;
