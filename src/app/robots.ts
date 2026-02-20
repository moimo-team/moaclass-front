import { SITE_URL, toAbsoluteUrl } from '@/constants/site';

import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: '*',
			allow: '/',
			disallow: [
				'/chats/',
				'/payments/',
				'/mypage/',
				'/lessons/manage/',
				'/lessons/*/schedule',
				'/login',
				'/join',
				'/find-password',
				'/reset-password',
				'/oauth/',
				'/user-info',
			],
		},
		sitemap: toAbsoluteUrl('/sitemap.xml'),
		host: SITE_URL,
	};
}
