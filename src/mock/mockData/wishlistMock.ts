import { fakerKO as faker } from '@faker-js/faker';

import { REGIONS } from '@/constants/regions';
import type { WishlistLessonItem } from '@/models/wishlist.model';

import { LESSON_CATEGORIES } from './categoryMock';

export const WishlistLessons: WishlistLessonItem[] = Array.from({ length: 10 }, (_, i) => {
	const price = faker.number.int({ min: 20000, max: 100000 });
	const discountRate = faker.helpers.arrayElement([0, 10, 15, 20, 30]);
	const discountedPrice = Math.floor(price * (1 - discountRate / 100));
	const category = LESSON_CATEGORIES[i % LESSON_CATEGORIES.length];
	const region = REGIONS[i % REGIONS.length];

	return {
		lessonId: i + 1,
		title: faker.helpers.arrayElement([
			'쉽게 배우는 가죽 공예: 카드 지갑 만들기',
			'나만의 향수 만들기 원데이 클래스',
			'오감을 깨우는 힐링 요가',
			'감성 가득 수채화 클래스',
			'홈베이킹: 촉촉한 파운드 케이크',
			'초보를 위한 주식 투자 입문',
			'도자기 물레 체험: 나만의 그릇 만들기',
			'프랑스 자수 기초반',
			'캘리그라피 입문 클래스',
			'천연 비누 만들기 체험',
		]),
		image: faker.helpers.arrayElement([
			'https://images.unsplash.com/photo-1524333865983-81f2df99be7e?q=80&w=800&auto=format&fit=crop',
			'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop',
			'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
			'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop',
			'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop',
			'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=800&auto=format&fit=crop',
			'https://images.unsplash.com/photo-1565191999001-551c187427bb?q=80&w=800&auto=format&fit=crop',
		]),
		category: category,
		teacherNickname: faker.helpers.arrayElement([
			'레더마스터',
			'센트아티스트',
			'요가베어',
			'아티스트김',
			'베이킹퀸',
			'스톡마스터',
			'클레이공방',
			'자수공주',
			'캘리작가',
			'비누장인',
		]),
		region: region,
		address: faker.location.city(),
		price,
		discountRate,
		discountedPrice,
		likes: faker.number.int({ min: 50, max: 500 }),
		rate: faker.number.float({ min: 4.0, max: 5.0, fractionDigits: 1 }),
	};
});
