import { useState } from 'react';

import { toast } from 'sonner';

interface UseLessonApplicationConfirmationProps {
	isLoggedIn: boolean;
	setShowLoginPrompt: (show: boolean) => void;
}

export const useLessonApplicationConfirmation = ({
	isLoggedIn,
	setShowLoginPrompt,
}: UseLessonApplicationConfirmationProps) => {
	const [showConfirmApply, setShowConfirmApply] = useState(false);
	const [tempSelectedDate, setTempSelectedDate] = useState<string | undefined>(undefined);
	const [tempHeadcount, setTempHeadcount] = useState(1);

	const onApplyLessonFromSidebar = (selectedDate: string | undefined, headcount: number) => {
		if (!isLoggedIn) {
			setShowLoginPrompt(true);
			return;
		}
		if (!selectedDate) {
			toast.error('날짜를 선택해주세요.');
			return;
		}
		setTempSelectedDate(selectedDate);
		setTempHeadcount(headcount);
		setShowConfirmApply(true);
	};

	const confirmApplyAction = () => {
		toast.success('클래스 신청이 완료되었습니다!');
		setShowConfirmApply(false);
		// API Endpoint: POST /api/lessons/{lessonId}/reserve
		// TODO: API 연동 필요 (클래스 예약 기능)
	};

	return {
		showConfirmApply,
		setShowConfirmApply,
		tempSelectedDate,
		tempHeadcount,
		onApplyLessonFromSidebar,
		confirmApplyAction,
	};
};
