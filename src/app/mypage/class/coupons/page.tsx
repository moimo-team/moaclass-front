import CouponsClient from './CouponsClient';

/**
 * SEO 담당자 전용: 메타데이터 설정 위치
 * 개인정보가 포함된 페이지이므로 인덱싱 차단(noindex) 설정을 권장합니다.
 * export const metadata: Metadata = {
 *   robots: { index: false, follow: false },
 * }
 */

export default function CouponsPage() {
	return <CouponsClient />;
}
