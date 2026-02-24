'use client';

import { Suspense, useLayoutEffect, useMemo, useState, useTransition } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Router, createPath } from 'react-router-dom';

import type { NavigationType, To } from 'react-router-dom';

const toSafeHref = (to: To): string => {
	const href = typeof to === 'string' ? to : createPath(to);
	if (!href || href.includes('[object Object]')) return '/';
	return href;
};

/**
 * Next.js 환경에서 react-router-dom의 Link 컴포넌트가 작동하도록 해주는 어댑터입니다.
 * shared 컴포넌트들이 react-router-dom에 의존하고 있을 때, 코드를 수정하지 않고
 * Next.js의 라우팅 시스템과 연동하기 위해 사용합니다.
 * useSearchParams()를 사용하는 실제 로직을 담은 내부 컴포넌트입니다.
 * Next.js 빌드 시 CSR Bailout을 방지하기 위해 Suspense로 감싸져야 합니다.
 */
function NextRouterContent({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [, startTransition] = useTransition();

	// 현재 위치 정보를 state로 관리
	const [state, setState] = useState({
		action: 'POP' as NavigationType,
		location: {
			pathname,
			search: searchParams.toString() ? `?${searchParams.toString()}` : '',
			hash: typeof window !== 'undefined' ? window.location.hash : '',
			state: null,
			key: 'default',
		},
	});

	// URL 변경 감지하여 location 업데이트 (Next.js 네비게이션 -> React Router 상태 동기화)
	useLayoutEffect(() => {
		setState({
			action: 'POP' as NavigationType, // Next.js 이동은 외부에서 발생한 것으로 간주
			location: {
				pathname,
				search: searchParams.toString() ? `?${searchParams.toString()}` : '',
				hash: window.location.hash,
				state: null,
				key: Math.random().toString(36).substring(2),
			},
		});
	}, [pathname, searchParams]);

	// custom navigator 구현 (React Router Link 클릭 -> Next.js router.push)
	const navigator = useMemo(
		() => ({
			createHref: (to: To) => {
				return toSafeHref(to);
			},
			push: (to: To) => {
				const href = toSafeHref(to);
				startTransition(() => {
					router.push(href);
				});
			},
			replace: (to: To) => {
				const href = toSafeHref(to);
				startTransition(() => {
					router.replace(href);
				});
			},
			go: (delta: number) => {
				if (delta < 0) router.back();
				else router.forward();
			},
		}),
		[router],
	);

	return (
		<Router location={state.location} navigationType={state.action} navigator={navigator}>
			{children}
		</Router>
	);
}

/**
 * Next.js 환경에서 react-router-dom의 Link 컴포넌트가 작동하도록 해주는 어댑터입니다.
 */
export default function NextRouterAdapter({ children }: { children: React.ReactNode }) {
	return (
		<Suspense fallback={null}>
			<NextRouterContent>{children}</NextRouterContent>
		</Suspense>
	);
}
