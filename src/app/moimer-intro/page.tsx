import MoimerIntroClient from '@/app/moimer-intro/MoimerIntroClient';
import { faqs } from '@/constants/moimerIntroData';
import { createPageMetadata } from '@/utils/metadata';

export const metadata = createPageMetadata({
	title: '모이머 안내',
	description: '모이머 신청하고 나만의 모임을 만들어보세요.',
	canonical: '/moimer-intro',
});

export default function Page() {
	const faqJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqs.map((faq) => ({
			'@type': 'Question',
			name: faq.question,
			acceptedAnswer: {
				'@type': 'Answer',
				text: faq.answer,
			},
		})),
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
			/>
			<MoimerIntroClient />
		</>
	);
}
