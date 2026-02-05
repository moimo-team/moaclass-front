import { useState } from "react";
import { cn } from "@/lib/utils";
import TeacherProfilePage from "./teacher/TeacherProfilePage";
import ClassManagementPage from "./manage/ClassManagementPage";

type TabType = "profile" | "classes";

const ClassDashboardPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  const tabs = [
    { id: "profile" as TabType, label: "모멘토 프로필" },
    { id: "classes" as TabType, label: "클래스 관리" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 좌측 사이드바 */}
      <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900">클래스 대시보드</h1>
        </div>
        <nav className="px-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full text-left px-4 py-3 rounded-lg mb-2 transition-colors font-medium",
                activeTab === tab.id
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* 우측 컨텐츠 영역 */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          {activeTab === "profile" && <TeacherProfilePage />}
          {activeTab === "classes" && <ClassManagementPage />}
        </div>
      </main>
    </div>
  );
};

export default ClassDashboardPage;
