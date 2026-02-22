/**
 * 화면을 최상단으로 스크롤합니다.
 */
export const scrollToTop = () => {
	if (typeof window !== 'undefined') {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
};
