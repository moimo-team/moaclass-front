import { useState, useEffect, useRef } from "react";
import { LESSON_TAB_TITLES } from "../constants/lessonTabs";

interface LessonDetailForTabs {
  id: number;
}

export const useLessonTabs = (
  lessonDetail: LessonDetailForTabs | undefined,
) => {
  const tabRefs = useRef<Record<string, HTMLElement | null>>({});
  const [activeTab, setActiveTab] = useState("intro");
  const tabTitles = LESSON_TAB_TITLES;

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    tabRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSectionRef = (id: string, el: HTMLElement | null) => {
    tabRefs.current[id] = el;
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-100px 0px -50% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveTab(entry.target.id);
        }
      });
    }, observerOptions);

    const currentTabRefs = tabRefs.current;

    Object.values(currentTabRefs).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      Object.values(currentTabRefs).forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [lessonDetail]);

  return { activeTab, tabTitles, handleTabClick, handleSectionRef };
};
