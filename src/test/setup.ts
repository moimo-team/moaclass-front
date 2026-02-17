import '@testing-library/jest-dom';
import { vi } from 'vitest';

// fetch 모킹 (undici 에러 방지)
Object.defineProperty(globalThis, 'fetch', {
	value: vi.fn(),
	writable: true,
});

// axios 모킹
vi.mock('axios', () => {
	const axiosInstance = {
		get: vi.fn().mockResolvedValue({ data: {} }),
		post: vi.fn().mockResolvedValue({ data: {} }),
		put: vi.fn().mockResolvedValue({ data: {} }),
		delete: vi.fn().mockResolvedValue({ data: {} }),
		interceptors: {
			request: { use: vi.fn(), eject: vi.fn() },
			response: { use: vi.fn(), eject: vi.fn() },
		},
		defaults: { headers: { common: {} } },
	};

	return {
		default: {
			create: vi.fn(() => axiosInstance),
			...axiosInstance,
		},
		...axiosInstance,
	};
});

// Kakao Maps API 모킹
(globalThis as any).kakao = {
	maps: {
		services: {
			Places: vi.fn().mockImplementation(() => ({
				keywordSearch: vi.fn(),
			})),
			Status: { OK: 'OK' },
		},
		LatLng: vi.fn(),
		Map: vi.fn(),
		Marker: vi.fn(),
	},
};

// IntersectionObserver 모킹
class MockIntersectionObserver {
	observe = vi.fn();
	disconnect = vi.fn();
	unobserve = vi.fn();
}
Object.defineProperty(window, 'IntersectionObserver', {
	writable: true,
	configurable: true,
	value: MockIntersectionObserver,
});

// ResizeObserver 모킹
class MockResizeObserver {
	observe = vi.fn();
	disconnect = vi.fn();
	unobserve = vi.fn();
}
Object.defineProperty(window, 'ResizeObserver', {
	writable: true,
	configurable: true,
	value: MockResizeObserver,
});

// matchMedia 모킹
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});

window.HTMLElement.prototype.scrollIntoView = vi.fn();
