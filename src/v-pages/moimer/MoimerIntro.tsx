import { useState } from 'react';

import FixedBottomButton from '@components/common/FixedBottomButton';
import FAQCard from '@features/moimer/FAQCard';
import GuidelineCard from '@features/moimer/GuidelineCard';
import InfoSection from '@features/moimer/InfoSection';

import moimerIntro from '@/assets/images/moimer-intro.png';
import moimer from '@/assets/images/moimer.png';
import LoginRequiredDialog from '@/components/features/login/LoginRequiredDialog';
import MoimerApplicationModal from '@/components/features/modal/create/CreateMeetingModal';
import { guidelines, faqs } from '@/constants/moimerIntroData';
import { useAuthStore } from '@/store/authStore';

export interface MoimerIntroProps {
	isLoggedIn: boolean;
	onOpenLoginPrompt: () => void;
}

export const MoimerIntroContent = ({ isLoggedIn, onOpenLoginPrompt }: MoimerIntroProps) => {
	const [openIndex, setOpenIndex] = useState<number | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleApplyClick = () => {
		if (!isLoggedIn) {
			onOpenLoginPrompt();
			return;
		}
		setIsModalOpen(true);
	};

	return (
		<article className="flex flex-col min-h-screen" aria-label="모임장 소개">
			<div className="bg-white">
				<InfoSection
					title="모임장이 뭔가요?"
					description={`모임장이란 모임을 개설하고 관리하는 사람입니다.\n단순히 모임을 만드는 사람을 넘어,\n사람들을 연결하고 의미 있는 경험을 만들어가는 리더입니다.\n\n모임의 주제를 정하고,\n참여자들이 즐겁고 유익한 시간을 보낼 수 있도록 준비하는 역할을 합니다.\n또한 모임이 원활하게 진행될 수 있도록\n분위기를 이끌어가는 것도 모임장의 중요한 역할입니다.\n\n모이모에서는 모임장을 위한 다양한 지원과 가이드를 제공하고 있으니\n부담 없이 모임장에 도전해보세요!`}
					illustration={moimer}
				/>
			</div>
			<div className="bg-sidebar">
				<InfoSection
					title="모임은 어떻게 개설하나요?"
					description={`아주 쉽습니다!\n\n하단의 '모임 개설하기'를 클릭하고 간단한 양식을 작성하면 됩니다.\n모임 개설 시, 모임에 대한 주제와 방향성을 설정하여 작성하면 더 좋습니다.\n\n신청 후 바로 모임을 생성할 수 있습니다.`}
					illustration={moimerIntro}
				/>
			</div>

			<section className="w-full bg-white">
				<div className="max-w-6xl mx-auto px-4 py-12">
					<h3 className="text-3xl font-bold text-foreground mb-8">
						이것만은 지켜주세요!
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{guidelines.map((g, i) => (
							<GuidelineCard key={i} title={g.title} description={g.description} />
						))}
					</div>
				</div>
			</section>

			<section className="w-full bg-sidebar">
				<div className="max-w-6xl mx-auto px-4 py-12">
					<h3 className="text-3xl font-bold text-foreground mb-8">FAQ</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{faqs.map((f, i) => (
							<FAQCard
								key={i}
								question={f.question}
								answer={f.answer}
								isOpen={openIndex === i}
								onToggle={() => setOpenIndex((prev) => (prev === i ? null : i))}
							/>
						))}
					</div>
				</div>
			</section>
			<div className="bg-white py-12">
				<FixedBottomButton onClick={handleApplyClick}>
					{isLoggedIn ? '모임 개설하기' : '로그인하고 모임 개설하기'}
				</FixedBottomButton>
			</div>

			<MoimerApplicationModal open={isModalOpen} onOpenChange={setIsModalOpen} />
		</article>
	);
};

function MoimerIntro() {
	const { isLoggedIn } = useAuthStore();
	const [showLoginPrompt, setShowLoginPrompt] = useState(false);

	return (
		<>
			<MoimerIntroContent
				isLoggedIn={isLoggedIn}
				onOpenLoginPrompt={() => setShowLoginPrompt(true)}
			/>
			<LoginRequiredDialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt} />
		</>
	);
}

export default MoimerIntro;
