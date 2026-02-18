'use client';

import TeacherProtectedRouteNext from '@/components/common/next/TeacherProtectedRouteNext';
import TeacherProfit from '@/pages/mypage/TeacherProfit';

const TeacherProfitClient = () => {
	return (
		<TeacherProtectedRouteNext>
			<TeacherProfit />
		</TeacherProtectedRouteNext>
	);
};

export default TeacherProfitClient;
