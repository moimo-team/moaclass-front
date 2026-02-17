import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import type { LessonDetail } from '@/models/lesson.model';

interface UseLessonApplicationConfirmationProps {
	isLoggedIn: boolean;
	setShowLoginPrompt: (show: boolean) => void;
	lessonDetail: LessonDetail | undefined;
}

export const useLessonApplicationConfirmation = ({
	isLoggedIn,
	setShowLoginPrompt,
	lessonDetail,
}: UseLessonApplicationConfirmationProps) => {
	const navigate = useNavigate();
	const [showConfirmApply, setShowConfirmApply] = useState(false);

	const [tempScheduleId, setTempScheduleId] = useState<number | null>(null);
	const [tempHeadcount, setTempHeadcount] = useState(1);

	const onApplyLessonFromSidebar = (scheduleId: number, headcount: number) => {
		if (!isLoggedIn) {
			setShowLoginPrompt(true);
			return;
		}
		setTempScheduleId(scheduleId);
		setTempHeadcount(headcount);
		setShowConfirmApply(true);
	};

	const confirmApplyAction = () => {
		if (!tempScheduleId) {
			toast.error('선택된 클래스 시간 정보가 없습니다.');
			setShowConfirmApply(false);
			return;
		}

		const scheduleId = tempScheduleId;
		const quantity = tempHeadcount;

		navigate(`/payments/preview?scheduleId=${scheduleId}&quantity=${quantity}`);
		setShowConfirmApply(false);
		toast.success('클래스 신청 페이지로 이동합니다.');
	};

	const selectedScheduleForDisplay = lessonDetail?.schedules.find((s) => s.id === tempScheduleId);

	return {
		showConfirmApply,
		setShowConfirmApply,
		selectedScheduleForDisplay,
		tempHeadcount,
		onApplyLessonFromSidebar,
		confirmApplyAction,
	};
};
