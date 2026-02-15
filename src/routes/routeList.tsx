import { Navigate } from 'react-router-dom';

import ProtectedRoute from '@/components/common/protected/ProtectedRoute';
import TeacherProtectedRoute from '@/components/common/protected/TeacherProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import Chatting from '@/pages/chat/Chatting';
import ClassDashboardPage from '@/pages/class/ClassDashboardPage';
import LessonDetail from '@/pages/class/LessonDetail';
import LessonListPage from '@/pages/class/LessonList';
import ScheduleManagementPage from '@/pages/class/manage/ScheduleManagementPage';
import Home from '@/pages/Home';
import Interests from '@/pages/interests/Interests';
import MeetingDetailPage from '@/pages/meetings/MeetingDetail';
import MeetingsPage from '@/pages/meetings/MeetingsPage';
import MeetingsSearchPage from '@/pages/meetings/MeetingsSearchPage';
import MoimerIntro from '@/pages/moimer/MoimerIntro';
import CancelClass from '@/pages/mypage/CancelClass';
import Coupons from '@/pages/mypage/Coupons';
import HostMeeting from '@/pages/mypage/HostMeeting';
import JoinedMeeting from '@/pages/mypage/JoinedMeeting';
import MypageSession from '@/pages/mypage/MypageSession';
import OrderList from '@/pages/mypage/OrderList';
import Participations from '@/pages/mypage/Participations';
import Points from '@/pages/mypage/Points';
import Profile from '@/pages/mypage/Profile';
import TeacherProfit from '@/pages/mypage/TeacherProfit';
import WishList from '@/pages/mypage/WishList';
import ClassPayment from '@/pages/pay/ClassPayment';
import FindPassword from '@/pages/user/FindPassword';
import Join from '@/pages/user/Join';
import KakaoCallback from '@/pages/user/KakaoCallback';
import Login from '@/pages/user/Login';
import ResetPassword from '@/pages/user/ResetPassword';
import UserInfo from '@/pages/user/UserInfo';

export const routeList = [
	{
		path: '/',
		element: <MainLayout />,
		// errorElement: <Error />,
		children: [
			{
				path: '/',
				element: <Home />,
			},
			{
				path: '/meetings',
				element: <MeetingsPage />,
			},
			{
				path: '/meetings/search',
				element: <MeetingsSearchPage />,
			},
			{
				path: '/meetings/:meetingId',
				element: <MeetingDetailPage />,
			},
			{
				path: '/login',
				element: <Login />,
			},
			{
				path: '/join',
				element: <Join />,
			},
			{
				path: '/find-password',
				element: <FindPassword />,
			},
			{
				path: '/reset-password',
				element: <ResetPassword />,
			},
			{
				path: '/oauth/kakao/callback',
				element: <KakaoCallback />,
			},
			{
				path: '/user-info',
				element: <UserInfo />,
			},
			{
				path: '/moimer-intro',
				element: <MoimerIntro />,
			},
			{
				path: '/chats',
				element: <Chatting />,
			},
			{
				path: '/lessons',
				element: <LessonListPage />,
			},
			{
				path: 'lessons/:lessonId',
				element: <LessonDetail />,
			},
			{
				path: '/lessons/:lessonId/schedule',
				element: (
					<ProtectedRoute>
						<ScheduleManagementPage />
					</ProtectedRoute>
				),
			},
			{
				path: '/classes-manage',
				element: (
					<ProtectedRoute>
						<ClassDashboardPage />
					</ProtectedRoute>
				),
			},
			{
				path: '/interests',
				element: <Interests />,
			},
			{
				path: '/payments/preview',
				element: (
					<ProtectedRoute>
						<ClassPayment />
					</ProtectedRoute>
				),
			},
			{
				path: '/mypage',
				element: (
					<ProtectedRoute>
						<MypageSession />
					</ProtectedRoute>
				),
				children: [
					{
						index: true,
						element: <Navigate to="profile" replace />,
					},
					{
						path: 'profile',
						element: <Profile />,
					},
					{
						path: 'class/wish-list',
						element: <WishList />,
					},
					{
						path: 'class/points',
						element: <Points />,
					},
					{
						path: 'class/coupons',
						element: <Coupons />,
					},
					{
						path: 'class/orders',
						element: <OrderList />,
					},
					{
						path: 'class/orders/:enrollmentId/cancel-info',
						element: <CancelClass />,
					},
					{
						path: 'class/profit',
						element: (
							<TeacherProtectedRoute>
								<TeacherProfit />
							</TeacherProtectedRoute>
						),
					},
					{
						path: 'meetings/join',
						element: <JoinedMeeting />,
					},
					{
						path: 'meetings/hosting',
						element: <HostMeeting />,
					},
					{
						path: 'meetings/hosting/:id/participations',
						element: <Participations />,
					},
				],
			},
		],
	},
];
