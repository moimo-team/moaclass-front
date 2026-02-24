export type SortEnum = 'PRICE_ASC' | 'PRICE_DESC' | 'RATE' | 'LIKES' | 'LATEST'; // '기본값

export const SORT_MAP: Record<string, SortEnum> = {
	'낮은 가격순': 'PRICE_ASC',
	'높은 가격순': 'PRICE_DESC',
	'평점 높은 순': 'RATE',
	'좋아요 많은 순': 'LIKES',
	최신순: 'LATEST',
};

export const REVERSE_SORT_MAP: Record<SortEnum, string> = {
	PRICE_ASC: '낮은 가격순',
	PRICE_DESC: '높은 가격순',
	RATE: '평점 높은 순',
	LIKES: '좋아요 많은 순',
	LATEST: '최신순',
};

export const getSortDisplayName = (sortEnum: SortEnum): string => {
	return REVERSE_SORT_MAP[sortEnum] || sortEnum;
};

export const getSortEnumValue = (displayName: string): SortEnum | undefined => {
	return SORT_MAP[displayName as keyof typeof SORT_MAP];
};
