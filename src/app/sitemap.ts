import { toAbsoluteUrl } from '@/constants/site';
import type { PaginationMeta } from '@/models/pagination.model';

import type { MetadataRoute } from 'next';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://13.55.7.237:3000';
const rawApiBase = process.env.NEXT_PUBLIC_API_URL ?? '/api';

const API_BASE_URL =
	rawApiBase.startsWith('http://') || rawApiBase.startsWith('https://')
		? rawApiBase
		: toAbsoluteUrl(rawApiBase);

type ApiListResponse<T> = {
	data: T[];
	meta?: PaginationMeta;
};

type SitemapLesson = {
	id: number;
	createdAt: string;
	updatedAt?: string;
};

type SitemapMeeting = {
	meetingId: number;
	meetingDate?: string;
};

const toValidDate = (value?: string): Date => {
	if (!value) return new Date();
	const parsed = new Date(value);
	return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

async function fetchAllPages<T>(path: string, limit = 100): Promise<T[]> {
	const items: T[] = [];
	let page = 1;
	let totalPages = 1;

	while (page <= totalPages) {
		// const url = new URL(`${API_BASE_URL}${path}`);
		const url = new URL(path, API_BASE_URL);
		url.searchParams.set('page', String(page));
		url.searchParams.set('limit', String(limit));

		const response = await fetch(url.toString(), {
			next: { revalidate: 3600 },
		});

		if (!response.ok) break;

		const json = (await response.json()) as ApiListResponse<T>;
		items.push(...(json.data ?? []));
		totalPages = json.meta?.totalPages ?? 1;
		page += 1;
	}

	return items;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const now = new Date();

	const staticRoutes: MetadataRoute.Sitemap = [
		'',
		'/lessons',
		'/meetings',
		'/meetings/search',
		'/moimer-intro',
		'/interests',
	].map((route) => ({
		url: toAbsoluteUrl(route),
		lastModified: now,
		changeFrequency: route === '' ? 'daily' : 'weekly',
		priority: route === '' ? 1 : 0.8,
	}));

	const [lessons, meetings] = await Promise.all([
		fetchAllPages<SitemapLesson>('/lessons').catch(() => []),
		fetchAllPages<SitemapMeeting>('/meetings').catch(() => []),
	]);

	const lessonRoutes: MetadataRoute.Sitemap = lessons.map((lesson) => ({
		url: toAbsoluteUrl(`/lessons/${lesson.id}`),
		lastModified: toValidDate(lesson.updatedAt ?? lesson.createdAt),
		changeFrequency: 'weekly',
		priority: 0.7,
	}));

	const meetingRoutes: MetadataRoute.Sitemap = meetings.map((meeting) => ({
		url: toAbsoluteUrl(`/meetings/${meeting.meetingId}`),
		lastModified: toValidDate(meeting.meetingDate),
		changeFrequency: 'weekly',
		priority: 0.6,
	}));

	return [...staticRoutes, ...lessonRoutes, ...meetingRoutes];
}
