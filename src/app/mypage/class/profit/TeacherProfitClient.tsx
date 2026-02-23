'use client';

import TeacherProtectedRoute from '@/components/common/protected/TeacherProtectedRoute';
import TeacherProfit from '@/pages/mypage/TeacherProfit';

const TeacherProfitClient = () => {
	return (
		<TeacherProtectedRoute>
			<TeacherProfit />
		</TeacherProtectedRoute>
	);
};

export default TeacherProfitClient;
