export const DEFAULT_CHAT_API_URL = 'http://localhost:3000';

const isMockingEnabled =
	import.meta.env.DEV && (import.meta.env.VITE_ENABLE_MOCK || 'true') === 'true';

export const CHAT_API_URL = isMockingEnabled
	? '/api'
	: import.meta.env.VITE_CHAT_API_URL || DEFAULT_CHAT_API_URL;
