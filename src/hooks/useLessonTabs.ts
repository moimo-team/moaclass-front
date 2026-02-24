import { useState, useEffect, useRef } from 'react';

import { LESSON_TAB_TITLES } from '@/constants/lessonTabs';

interface LessonDetailForTabs {
	id: number;
}

export const useLessonTabs = (lessonDetail: LessonDetailForTabs | undefined) => {
	const tabRefs = useRef<Record<string, HTMLElement | null>>({});
	const isProgrammaticScrollingRef = useRef(false);
	const releaseProgrammaticScrollTimerRef = useRef<number | null>(null);
	const [activeTab, setActiveTab] = useState('intro');
	const tabTitles = LESSON_TAB_TITLES;
	const SECTION_OFFSET = 164;

	const handleTabClick = (id: string) => {
		setActiveTab(id);
		const targetSection = tabRefs.current[id];
		if (!targetSection || typeof window === 'undefined') return;

		isProgrammaticScrollingRef.current = true;
		if (releaseProgrammaticScrollTimerRef.current) {
			window.clearTimeout(releaseProgrammaticScrollTimerRef.current);
		}

		const targetTop =
			window.scrollY + targetSection.getBoundingClientRect().top - SECTION_OFFSET;
		window.scrollTo({
			top: Math.max(0, targetTop),
			behavior: 'smooth',
		});

		releaseProgrammaticScrollTimerRef.current = window.setTimeout(() => {
			isProgrammaticScrollingRef.current = false;
		}, 500);
	};

	const handleSectionRef = (id: string, el: HTMLElement | null) => {
		tabRefs.current[id] = el;
	};

	useEffect(() => {
		if (typeof window === 'undefined') return;

		const updateActiveTabByScroll = () => {
			if (isProgrammaticScrollingRef.current) return;

			const targetLine = SECTION_OFFSET + 1;
			const sections = tabTitles
				.map((tab) => tabRefs.current[tab.id])
				.filter((section): section is HTMLElement => Boolean(section));

			if (sections.length === 0) return;

			const lastSection = sections[sections.length - 1];
			const reachedPageBottom =
				window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
			if (reachedPageBottom) {
				setActiveTab(lastSection.id);
				return;
			}

			let nextActiveId = sections[0].id;
			for (const section of sections) {
				if (section.getBoundingClientRect().top <= targetLine) {
					nextActiveId = section.id;
				} else {
					break;
				}
			}

			setActiveTab((prev) => (prev === nextActiveId ? prev : nextActiveId));
		};

		updateActiveTabByScroll();
		window.addEventListener('scroll', updateActiveTabByScroll, { passive: true });
		window.addEventListener('resize', updateActiveTabByScroll);

		return () => {
			window.removeEventListener('scroll', updateActiveTabByScroll);
			window.removeEventListener('resize', updateActiveTabByScroll);
			if (releaseProgrammaticScrollTimerRef.current) {
				window.clearTimeout(releaseProgrammaticScrollTimerRef.current);
				releaseProgrammaticScrollTimerRef.current = null;
			}
		};
	}, [lessonDetail, tabTitles]);

	return { activeTab, tabTitles, handleTabClick, handleSectionRef };
};
