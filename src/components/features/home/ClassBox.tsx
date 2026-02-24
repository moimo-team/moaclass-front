import type { ReactNode } from 'react';

import { motion } from 'framer-motion';

interface ClassBoxProps {
	children: ReactNode;
	className?: string;
}

/**
 * 홈 화면의 클래스 섹션을 감싸는 프리미엄 컨테이너 컴포넌트
 * - 스크롤 시 부드럽게 솟아오르는 애니메이션 적용
 * - 일관된 박스 스타일 제공
 */
export default function ClassBox({ children, className }: ClassBoxProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 40 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: false, margin: '-100px' }}
			transition={{
				duration: 0.8,
				ease: [0.215, 0.61, 0.355, 1], // easeOutCubic
			}}
			className={className}
		>
			{children}
		</motion.div>
	);
}
