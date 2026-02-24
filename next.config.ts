import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		domains: [
			'localhost',
			'moaclass-back.vercel.app',
			'moaclass-back.onrender.com',
			'picsum.photos',
			'avatars.githubusercontent.com',
			'cdn.jsdelivr.net',
			'loremflickr.com', // 외부 이미지 호스트를 images 허용 목록에 등록
			'storage.googleapis.com',
			'images.unsplash.com',
			'example.com',
			'lh3.googleusercontent.com',
		],
	},
	async rewrites() {
		return [
			{
				source: '/api/:path*',
				destination: 'https://moaclass-back.onrender.com/:path*',
			},
		];
	},
};
export default nextConfig;
