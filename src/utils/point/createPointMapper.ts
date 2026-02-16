import type { PointType } from '@/models/point.model';

export const createPointMapper =
	<T extends readonly string[]>(map: Partial<Record<PointType, T[number]>>) =>
	(type: PointType): T[number] | undefined =>
		map[type];
