import MainLayout from "@/components/layout/MainLayout";
import Home from "@/pages/Home";
import MeetingDetailPage from "@/pages/meetings/MeetingDetail";
import MeetingsPage from "@/pages/meetings/MeetingsPage";
import MeetingsSearchPage from "@/pages/meetings/MeetingsSearchPage";
import Login from "@/pages/user/Login";
import Join from "@/pages/user/Join";
import FindPassword from "@/pages/user/FindPassword";
import ResetPassword from "@/pages/user/ResetPassword";
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
        path: "/mypage",
        element: (
          <ProtectedRoute>
            <MypageSession />,
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
      {
        path: "/interests",
        element: <Interests />,
      },
    ],
  },
];
