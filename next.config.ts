import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		domains: ['localhost', 'moaclass-back.vercel.app', 'moaclass-back.onrender.com'],
	},
	async rewrites() {
		return [
			{
				source: '/api/:path*',
				destination: 'https://moaclass-back.vercel.app/:path*',
			},
		];
	},
};
export default nextConfig;
