import MainLayout from "@/components/layout/MainLayout";
import Home from "@/pages/Home";
import MeetingDetailPage from "@/pages/meetings/MeetingDetail";
import MeetingsPage from "@/pages/meetings/MeetingsPage";
import MeetingsSearchPage from "@/pages/meetings/MeetingsSearchPage";
import Login from "@/pages/user/Login";
import Join from "@/pages/user/Join";
import FindPassword from "@/pages/user/FindPassword";
import ResetPassword from "@/pages/user/ResetPassword";
import KakaoCallback from "@/pages/user/KakaoCallback";
import MypageSession from "@/pages/mypage/MypageSession";
import Profile from "@/pages/mypage/Profile";
import JoinedMeeting from "@/pages/mypage/JoinedMeeting";
import HostMeeting from "@/pages/mypage/HostMeeting";
import Participations from "@/pages/mypage/Participations";
import { Navigate } from "react-router-dom";
import MoimerIntro from "@/pages/moimer/MoimerIntro";
import UserInfo from "@/pages/user/UserInfo";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import Interests from "@/pages/interests/Interests";
import Chatting from "@/pages/chat/Chatting";
import ClassPayment from "@/pages/pay/ClassPayment";
import WishList from "@/pages/mypage/WishList";
import Points from "@/pages/mypage/Points";
import Coupons from "@/pages/mypage/Coupons";
import OrderList from "@/pages/mypage/OrderList";
import CancelClass from "@/pages/mypage/CancelClass";
import ClassDashboardPage from "@/pages/class/ClassDashboardPage";
import LessonListPage from "@/pages/class/LessonList";
import LessonDetail from "@/pages/class/LessonDetail";

export const routeList = [
  {
    path: "/",
    element: <MainLayout />,
    // errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/meetings",
        element: <MeetingsPage />,
      },
      {
        path: "/meetings/search",
        element: <MeetingsSearchPage />,
      },
      {
        path: "/meetings/:meetingId",
        element: <MeetingDetailPage />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/join",
        element: <Join />,
      },
      {
        path: "/find-password",
        element: <FindPassword />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
      {
        path: "/oauth/kakao/callback",
        element: <KakaoCallback />,
      },
      {
        path: "/user-info",
        element: <UserInfo />,
      },
      {
        path: "/moimer-intro",
        element: <MoimerIntro />,
      },
      {
        path: "/chats",
        element: <Chatting />,
      },
      {
        path: "/lessons",
        element: <LessonListPage />,
      },
      {
        path: "lessons/:lessonId",
        element: <LessonDetail />,
      },
      {
        path: "/classes-manage",
        element: (
          <ProtectedRoute>
            <ClassDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/interests",
        element: <Interests />,
      },
      {
        path: "/pay-class/:lessonId/:scheduleId/:quantity",
        element: (
          <ProtectedRoute>
            <ClassPayment />
          </ProtectedRoute>
        ),
      },
      {
        path: "/mypage",
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
            path: "profile",
            element: <Profile />,
          },
          {
            path: "class/wish-list",
            element: <WishList />,
          },
          {
            path: "class/points",
            element: <Points />,
          },
          {
            path: "class/coupons",
            element: <Coupons />,
          },
          {
            path: "class/orders",
            element: <OrderList />,
          },
          {
            path: "class/orders/:id/cancel",
            element: <CancelClass />,
          },
          {
            path: "meetings/join",
            element: <JoinedMeeting />,
          },
          {
            path: "meetings/hosting",
            element: <HostMeeting />,
          },
          {
            path: "meetings/hosting/:id/participations",
            element: <Participations />,
          },
        ],
      },
    ],
  },
];
