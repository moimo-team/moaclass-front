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
		sitemap: 'https://www.moaclass.com/sitemap.xml',
		host: 'https://www.moaclass.com',
	};
}
