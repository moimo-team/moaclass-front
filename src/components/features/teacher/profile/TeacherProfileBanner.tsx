import React from 'react';

interface TeacherProfileBannerProps {
	image?: string;
}

export const TeacherProfileBanner: React.FC<TeacherProfileBannerProps> = ({ image }) => {
	return (
		<div className="relative h-64 md:h-80 w-full overflow-hidden bg-primary/10">
			{image && (
				<div
					className="absolute inset-0 bg-cover bg-center blur-md opacity-30 scale-110"
					style={{ backgroundImage: `url(${image})` }}
				/>
			)}
			<div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/50" />
		</div>
	);
};
