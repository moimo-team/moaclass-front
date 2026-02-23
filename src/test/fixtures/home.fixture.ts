export interface HomeCategoryFixture {
	id: number;
	name: string;
}

export const HOME_CATEGORIES = {
	all: [
		{ id: 10, name: '체험' },
		{ id: 11, name: '핸드메이드' },
	] as HomeCategoryFixture[],
	experienceOnly: [{ id: 10, name: '체험' }] as HomeCategoryFixture[],
	none: [] as HomeCategoryFixture[],
};

export const HOME_SECTION_LINKS = {
	likes: '/lessons?sort=LIKES',
	experience: (id: number) => `/lessons?categoryId=${id}&sort=LATEST`,
	handmade: (id: number) => `/lessons?categoryId=${id}&sort=LATEST`,
	region: (id: number) => `/lessons?regionId=${id}&sort=LATEST`,
};
