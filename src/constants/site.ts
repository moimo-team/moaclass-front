export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://moaclass.vercel.app';

export const toAbsoluteUrl = (path: string): string => {
	if (path.startsWith('http://') || path.startsWith('https://')) {
		return path;
	}

	const normalizedPath = path.startsWith('/') ? path : `/${path}`;
	return `${SITE_URL}${normalizedPath}`;
};
